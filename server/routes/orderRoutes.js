import express from "express";
import {
  createOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, shopOwnerOnly, customerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, customerOnly, createOrder);
router.get("/mine", protect, customerOnly, getMyOrders);
router.get("/shop", protect, shopOwnerOnly, getShopOrders);
router.put("/:id/status", protect, shopOwnerOnly, updateOrderStatus);

export default router;
