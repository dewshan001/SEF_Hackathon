import Order from "../models/orderModel.js";
import Stock from "../models/stockModel.js";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";
import { sendMockEmail } from "../utils/sendEmail.js";

// @desc    Create an order (books a cylinder — no payment involved)
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = async (req, res) => {
  try {
    const { stockId, quantity, deliveryAddress } = req.body;
    const qty = Number(quantity);

    if (!stockId || !qty || qty < 1) {
      return res.status(400).json({ message: "stockId and a positive quantity are required" });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    if (stock.quantity < qty) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const shop = await Shop.findById(stock.shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    stock.quantity -= qty;
    await stock.save();

    const order = await Order.create({
      customerId: req.user._id,
      shopId: shop._id,
      cylinderDetails: {
        brand: stock.brand,
        size: stock.size,
        quantityPurchased: qty,
        pricePerUnit: stock.price,
      },
      totalAmount: stock.price * qty,
      deliveryAddress: deliveryAddress
        ? {
            type: "Point",
            coordinates: deliveryAddress.coordinates || [0, 0],
            text: deliveryAddress.text,
          }
        : undefined,
    });

    const shopOwner = await User.findById(shop.ownerId);

    sendMockEmail({
      to: req.user.email,
      subject: "Your GasGo Lanka booking is confirmed",
      text: `You booked ${qty} × ${stock.brand} ${stock.size} from ${shop.shopName}. Total: LKR ${order.totalAmount}. The shop owner has been notified.`,
    });

    if (shopOwner) {
      sendMockEmail({
        to: shopOwner.email,
        subject: "New gas cylinder booking",
        text: `${req.user.name} booked ${qty} × ${stock.brand} ${stock.size} (LKR ${order.totalAmount}) at ${shop.shopName}. Contact: ${req.user.phone}.`,
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the logged-in customer's orders
// @route   GET /api/orders/mine
// @access  Private/Customer
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate("shopId", "shopName contactNumber")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders booked at the logged-in shop owner's shop
// @route   GET /api/orders/shop
// @access  Private/ShopOwner
export const getShopOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.json([]);

    const orders = await Order.find({ shopId: shop._id })
      .populate("customerId", "name phone email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an order's status
// @route   PUT /api/orders/:id/status
// @access  Private/ShopOwner
export const updateOrderStatus = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const { status } = req.body;
    if (!["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({ _id: req.params.id, shopId: shop._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
