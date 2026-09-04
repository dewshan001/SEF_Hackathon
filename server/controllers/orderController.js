import Order from "../models/orderModel.js";
import Cylinder from "../models/cylinderModel.js";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";
import { generateOrderToken } from "../utils/generateOrderToken.js";
import { sendEmail, orderConfirmationEmail, newOrderAlertEmail } from "../utils/sendEmail.js";

// ── @desc   Place a new multi-item order
// ── @route  POST /api/orders
// ── @access Private/Customer
export const createOrder = async (req, res) => {
  try {
    const { shopId, items } = req.body;

    // Basic validation
    if (!shopId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "shopId and at least one item are required" });
    }

    // Verify shop exists
    const shop = await Shop.findById(shopId);
    if (!shop || !shop.isActive) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Validate and check stock for every item
    const resolvedItems = [];
    for (const item of items) {
      const { cylinderId, quantity } = item;
      const qty = Number(quantity);

      if (!cylinderId || !qty || qty < 1) {
        return res.status(400).json({ message: "Each item must have a cylinderId and a positive quantity" });
      }

      // Fetch cylinder — ensure it belongs to the requested shop
      const cylinder = await Cylinder.findOne({ _id: cylinderId, shopId });
      if (!cylinder) {
        return res.status(404).json({ message: `Cylinder not found in this shop` });
      }

      // Stock check
      if (cylinder.availableQuantity < qty) {
        return res.status(400).json({
          message: `Only ${cylinder.availableQuantity} unit(s) of ${cylinder.sizeKg} ${cylinder.gasType} are currently available.`,
        });
      }

      resolvedItems.push({ cylinder, qty });
    }

    // Generate unique token (retry once on collision)
    let token = generateOrderToken();
    const existing = await Order.findOne({ token });
    if (existing) token = generateOrderToken();

    // Build order items payload & reduce stock atomically
    const orderItems = [];
    for (const { cylinder, qty } of resolvedItems) {
      // Re-read and decrement stock to prevent race conditions
      const updated = await Cylinder.findOneAndUpdate(
        { _id: cylinder._id, shopId, availableQuantity: { $gte: qty } },
        { $inc: { availableQuantity: -qty } },
        { new: true }
      );

      if (!updated) {
        // Stock was taken by another request — attempt rollback already-decremented items
        // Restore any already decremented
        for (const done of orderItems) {
          await Cylinder.findByIdAndUpdate(done.cylinder, { $inc: { availableQuantity: done.quantity } });
        }
        return res.status(400).json({
          message: `Stock changed while placing your order. Please try again.`,
        });
      }

      orderItems.push({
        cylinder: cylinder._id,
        cylinderSize: cylinder.sizeKg,
        gasType: cylinder.gasType,
        quantity: qty,
        price: cylinder.price,
        capacityLitres: cylinder.capacityLitres,
      });
    }

    const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      customerId: req.user._id,
      shopId: shop._id,
      token,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("shopId", "shopName address contactNumber location")
      .populate("customerId", "name email phone");

    // Send emails (non-blocking — errors don't cancel the order)
    try {
      const shopOwner = await User.findById(shop.ownerId);
      const customerEmail = orderConfirmationEmail({
        token,
        shopName: shop.shopName,
        shopAddress: shop.address,
        shopPhone: shop.contactNumber,
        items: orderItems,
        totalAmount,
        status: "pending",
        customerName: req.user.name,
      });
      sendEmail({ to: req.user.email, ...customerEmail });

      if (shopOwner && shopOwner.email) {
        const ownerEmail = newOrderAlertEmail({
          token,
          customerName: req.user.name,
          customerEmail: req.user.email,
          customerPhone: req.user.phone,
          items: orderItems,
          totalAmount,
          shopName: shop.shopName,
        });
        sendEmail({ to: shopOwner.email, ...ownerEmail });
      }
    } catch (emailErr) {
      console.error("Email error (non-fatal):", emailErr.message);
    }

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get logged-in customer's own orders
// ── @route GET /api/orders/my
// ── @access Private/Customer
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate("shopId", "shopName address contactNumber location")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get a single order — customer sees own, owner sees shop's, admin sees all
// ── @route GET /api/orders/:id
// ── @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("shopId", "shopName address contactNumber location")
      .populate("customerId", "name email phone");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const { role, _id } = req.user;

    if (role === "CUSTOMER") {
      if (order.customerId._id.toString() !== _id.toString()) {
        return res.status(403).json({ message: "You do not have permission to view this order" });
      }
    } else if (role === "SHOP_OWNER") {
      const shop = await Shop.findOne({ ownerId: _id });
      if (!shop || order.shopId._id.toString() !== shop._id.toString()) {
        return res.status(403).json({ message: "You do not have permission to view this order" });
      }
    }
    // ADMIN can see all

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get orders for the owner's shop
// ── @route GET /api/owner/orders
// ── @access Private/ShopOwner
export const getShopOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.json([]);

    const orders = await Order.find({ shopId: shop._id })
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Update order status (owner only)
// ── @route PATCH /api/owner/orders/:id/status
// ── @access Private/ShopOwner
export const updateOrderStatus = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const { status } = req.body;
    const VALID_STATUSES = ["pending", "ready", "collected", "cancelled"];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be: pending, ready, collected, cancelled" });
    }

    const order = await Order.findOne({ _id: req.params.id, shopId: shop._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Validate transitions
    const transitions = {
      pending: ["ready", "cancelled"],
      ready: ["collected", "cancelled"],
      collected: [],
      cancelled: [],
    };
    if (!transitions[order.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from '${order.status}' to '${status}'`,
      });
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Restore stock if cancelled
    if (status === "cancelled" && previousStatus !== "cancelled") {
      for (const item of order.items) {
        await Cylinder.findByIdAndUpdate(item.cylinder, {
          $inc: { availableQuantity: item.quantity },
        });
      }
    }

    const populated = await Order.findById(order._id)
      .populate("customerId", "name email phone")
      .populate("shopId", "shopName address");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
