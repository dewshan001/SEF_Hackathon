import express from "express";
import {
  createOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("CUSTOMER"), createOrder);
router.get("/mine", protect, authorize("CUSTOMER"), getMyOrders);
router.get("/shop", protect, authorize("SHOP_OWNER"), getShopOrders);
router.put("/:id/status", protect, authorize("SHOP_OWNER"), updateOrderStatus);

export default router;
