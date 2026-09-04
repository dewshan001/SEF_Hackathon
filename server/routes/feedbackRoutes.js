import express from "express";
import {
  getShopFeedbacks,
  getOrderFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Authenticated — view feedbacks of a shop
router.get("/shop/:shopId", getShopFeedbacks);
router.get("/order/:orderId", protect, getOrderFeedback);

// Private — add feedback for a shop
router.post("/shop/:shopId", protect, createFeedback);

// Private — customer edits own feedback, or Admin edits any feedback
router.put("/:id", protect, updateFeedback);
router.patch("/:id", protect, updateFeedback);

// Private — customer deletes own feedback, or Admin deletes any feedback
router.delete("/:id", protect, deleteFeedback);

export default router;
