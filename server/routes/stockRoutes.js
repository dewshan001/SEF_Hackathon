import express from "express";
import {
  getStocks,
  getMyStocks,
  createStock,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getStocks);
router.get("/mine", protect, authorize("SHOP_OWNER"), getMyStocks);
router.post("/", protect, authorize("SHOP_OWNER"), createStock);
router.put("/:id", protect, authorize("SHOP_OWNER"), updateStock);
router.delete("/:id", protect, authorize("SHOP_OWNER"), deleteStock);

export default router;
