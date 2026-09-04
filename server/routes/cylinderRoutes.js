import express from "express";
import {
  getShopCylinders,
  getCylinderById,
  getMyCylinders,
  createCylinder,
  updateCylinder,
  updateCylinderStock,
  deleteCylinder,
} from "../controllers/cylinderController.js";
import { protect, shopOwnerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public — browse shop cylinders
router.get("/shop/:shopId", getShopCylinders);
router.get("/:id", getCylinderById);

// Private — owner manages own cylinders
router.get("/", protect, shopOwnerOnly, getMyCylinders);
router.get("/mine", protect, shopOwnerOnly, getMyCylinders);
router.post("/", protect, shopOwnerOnly, createCylinder);
router.patch("/:id", protect, shopOwnerOnly, updateCylinder);
router.put("/:id", protect, shopOwnerOnly, updateCylinder);
router.patch("/:id/stock", protect, shopOwnerOnly, updateCylinderStock);
router.delete("/:id", protect, shopOwnerOnly, deleteCylinder);

export default router;
