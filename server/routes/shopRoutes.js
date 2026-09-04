import express from "express";
import { getMyShop, createShop } from "../controllers/shopController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", protect, authorize("SHOP_OWNER"), getMyShop);
router.post("/", protect, authorize("SHOP_OWNER"), createShop);

export default router;
