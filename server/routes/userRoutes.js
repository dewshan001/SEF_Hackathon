import express from "express";
import {
  getUsers,
  getUserById,
  updateProfile,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getUsers);
router.route("/profile").put(protect, updateProfile);
router.route("/:id").get(protect, admin, getUserById).delete(protect, admin, deleteUser);

export default router;
