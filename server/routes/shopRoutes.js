import express from "express";
import {
  getAllShops,
  getShopById,
  getMyShop,
  createShop,
  updateMyShop,
} from "../controllers/shopController.js";
import { getShopCylinders } from "../controllers/cylinderController.js";
import { protect, shopOwnerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllShops);
router.get("/:shopId/cylinders", getShopCylinders);
router.get("/:id", getShopById);

// Private - ShopOwner
router.get("/mine", protect, shopOwnerOnly, getMyShop);
router.post("/", protect, shopOwnerOnly, createShop);
router.patch("/mine", protect, shopOwnerOnly, updateMyShop);

export default router;
