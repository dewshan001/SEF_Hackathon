import { body, validationResult } from "express-validator";

// ── Helper: collect validation errors and respond 422 ──────────────────────
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Register validation rules ──────────────────────────────────────────────
export const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^(?:\+94|0)?(?:7[0-9])\d{7}$|^0\d{9}$/)
    .withMessage("Enter a valid Sri Lankan phone number (e.g. 077 123 4567)"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["ADMIN", "SHOP_OWNER", "CUSTOMER"])
    .withMessage("Role must be ADMIN, SHOP_OWNER, or CUSTOMER"),

  // address is optional on register; validate if present
  body("address.textAddress")
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage("Address is too short"),

  body("address.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),
];

// ── Login validation rules ─────────────────────────────────────────────────
export const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];
