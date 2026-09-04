import express from "express";
import { register, login, getMe, updatePushToken } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerRules,
  loginRules,
  validate,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerRules, validate, register);
router.post("/login",    loginRules,    validate, login);

// Private routes (any authenticated role)
router.get("/me",           protect, getMe);
router.put("/push-token",   protect, updatePushToken);

export default router;
