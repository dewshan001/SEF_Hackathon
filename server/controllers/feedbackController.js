import Feedback from "../models/feedbackModel.js";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";

// ── @desc   Get all feedbacks for a shop
// ── @route  GET /api/feedbacks/shop/:shopId
// ── @access Public / Authenticated
export const getShopFeedbacks = async (req, res) => {
  try {
    const { shopId } = req.params;
    const feedbacks = await Feedback.find({ shopId })
      .populate("customerId", "name email role")
      .populate("orderId", "token status items totalAmount createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc   Get feedback for a specific order
// ── @route  GET /api/feedbacks/order/:orderId
// ── @access Authenticated
export const getOrderFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;
    const feedback = await Feedback.findOne({ orderId })
      .populate("customerId", "name email role")
      .lean();

    res.json(feedback || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc   Add feedback for a shop / order
// ── @route  POST /api/feedbacks/shop/:shopId
// ── @access Private (Customer & Admin)
export const createFeedback = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { rating, comment, orderId, token } = req.body;

    if (!rating || !comment || !comment.trim()) {
      return res.status(400).json({ message: "Rating and feedback comment are required" });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const feedback = await Feedback.create({
      shopId,
      customerId: req.user._id,
      rating: Number(rating),
      comment: comment.trim(),
      orderId: orderId || null,
      token: token || null,
    });

    const populated = await Feedback.findById(feedback._id)
      .populate("customerId", "name email role")
      .populate("orderId", "token status items totalAmount");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc   Update a feedback
// ── @route  PUT /api/feedbacks/:id
// ── @access Private (Owner of feedback or Admin)
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Authorization: customer can edit own feedback, ADMIN can edit any feedback
    const isOwner = feedback.customerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to edit this feedback" });
    }

    if (rating !== undefined) feedback.rating = Math.min(5, Math.max(1, Number(rating)));
    if (comment !== undefined) feedback.comment = comment.trim();

    await feedback.save();

    const populated = await Feedback.findById(feedback._id)
      .populate("customerId", "name email role");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc   Delete a feedback
// ── @route  DELETE /api/feedbacks/:id
// ── @access Private (Owner of feedback or Admin)
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Authorization: customer can delete own feedback, ADMIN can delete any feedback
    const isOwner = feedback.customerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this feedback" });
    }

    await Feedback.findByIdAndDelete(id);

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
