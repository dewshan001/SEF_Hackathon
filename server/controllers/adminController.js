import User from "../models/userModel.js";
import Shop from "../models/shopModel.js";
import Cylinder from "../models/cylinderModel.js";
import Order from "../models/orderModel.js";

// ── @desc  Get all users
// ── @route GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get all customers
// ── @route GET /api/admin/customers
export const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: "CUSTOMER" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get all shop owners
// ── @route GET /api/admin/owners
export const getAllOwners = async (req, res) => {
  try {
    const users = await User.find({ role: "SHOP_OWNER" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get all shops
// ── @route GET /api/admin/shops
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate("ownerId", "name email phone")
      .sort({ createdAt: -1 });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get all cylinders
// ── @route GET /api/admin/cylinders
export const getAllCylinders = async (req, res) => {
  try {
    const cylinders = await Cylinder.find()
      .populate("shopId", "shopName")
      .sort({ createdAt: -1 });
    res.json(cylinders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get all orders
// ── @route GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email phone")
      .populate("shopId", "shopName address")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get system statistics
// ── @route GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [totalCustomers, totalOwners, totalShops, totalCylinders, totalOrders] =
      await Promise.all([
        User.countDocuments({ role: "CUSTOMER" }),
        User.countDocuments({ role: "SHOP_OWNER" }),
        Shop.countDocuments(),
        Cylinder.countDocuments(),
        Order.countDocuments(),
      ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusCounts = ordersByStatus.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {});

    res.json({
      totalCustomers,
      totalOwners,
      totalShops,
      totalCylinders,
      totalOrders,
      ordersByStatus: statusCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
