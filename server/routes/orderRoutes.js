import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getShopOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  protect,
  shopOwnerOnly,
  customerOnly,
  adminOrOwner,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer
router.post("/", protect, customerOnly, createOrder);
router.get("/my", protect, customerOnly, getMyOrders);

// Shared (role-checked inside controller)
router.get("/:id", protect, getOrderById);

// Owner
router.get("/shop/all", protect, shopOwnerOnly, getShopOrders);
router.patch("/:id/status", protect, shopOwnerOnly, updateOrderStatus);

export default router;
