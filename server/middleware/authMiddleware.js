import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ── protect ────────────────────────────────────────────────────────────────
// Verifies JWT from Authorization: Bearer <token>
// Attaches req.user on success
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized — no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized — user not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized — token invalid or expired" });
  }
};

// ── authorizeRoles ─────────────────────────────────────────────────────────
// Usage: authorizeRoles("ADMIN", "SHOP_OWNER")
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(", ")}`,
      });
    }
    next();
  };
};

// ── Convenience aliases ────────────────────────────────────────────────────
export const adminOnly      = authorizeRoles("ADMIN");
export const shopOwnerOnly  = authorizeRoles("SHOP_OWNER");
export const customerOnly   = authorizeRoles("CUSTOMER");
export const adminOrOwner   = authorizeRoles("ADMIN", "SHOP_OWNER");

// Backwards-compatible alias (old code used: protect, admin)
export const admin = adminOnly;
