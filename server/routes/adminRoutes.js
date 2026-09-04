import express from "express";
import { getAdminStats, getDbStatus } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/stats").get(protect, admin, getAdminStats);
router.route("/db-status").get(protect, admin, getDbStatus);

export default router;
