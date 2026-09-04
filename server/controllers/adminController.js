import mongoose from "mongoose";
import User from "../models/userModel.js";

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const customerCount = await User.countDocuments({ role: "CUSTOMER" });
    const ownerCount = await User.countDocuments({ role: "SHOP_OWNER" });
    
    // Placeholder for Orders until Order model is implemented
    const orderCount = 0; 
    const deliveredCount = 0;

    res.json({
      customers: customerCount,
      owners: ownerCount,
      orders: orderCount,
      deliveredOrders: deliveredCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get database connection status
// @route   GET /api/admin/db-status
// @access  Private/Admin
export const getDbStatus = async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting, 99: uninitialized
    const isConnected = state === 1;
    
    res.json({
      connected: isConnected,
      state: state,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
