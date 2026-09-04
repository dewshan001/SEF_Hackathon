import express from "express";
import { getMyShop, createShop } from "../controllers/shopController.js";
import { protect, shopOwnerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", protect, shopOwnerOnly, getMyShop);
router.post("/", protect, shopOwnerOnly, createShop);

export default router;
