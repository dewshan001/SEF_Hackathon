import express from "express";
import {
  getAllUsers,
  getAllCustomers,
  getAllOwners,
  getAllShops,
  getAllCylinders,
  getAllOrders,
  getStats,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication + ADMIN role
router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.get("/customers", getAllCustomers);
router.get("/owners", getAllOwners);
router.get("/shops", getAllShops);
router.get("/cylinders", getAllCylinders);
router.get("/orders", getAllOrders);

export default router;
