import express from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  deleteUser,
  changeAdminPassword,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getUsers).post(protect, admin, createUser);
router.route("/profile").put(protect, updateProfile);
router.route("/change-password").put(protect, admin, changeAdminPassword);
router.route("/:id").get(protect, admin, getUserById).delete(protect, admin, deleteUser);

export default router;
