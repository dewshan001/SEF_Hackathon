import express from "express";
import {
  getStocks,
  getMyStocks,
  createStock,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";
import { protect, shopOwnerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getStocks);
router.get("/mine", protect, shopOwnerOnly, getMyStocks);
router.post("/", protect, shopOwnerOnly, createStock);
router.put("/:id", protect, shopOwnerOnly, updateStock);
router.delete("/:id", protect, shopOwnerOnly, deleteStock);

export default router;
