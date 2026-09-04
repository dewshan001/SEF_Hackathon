import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// ── Helper: build safe user payload ───────────────────────────────────────
const userPayload = (user, token) => ({
  _id:         user._id,
  name:        user.name,
  email:       user.email,
  role:        user.role,
  phone:       user.phone,
  address:     user.address,
  pushToken:   user.pushToken,
  createdAt:   user.createdAt,
  token,
});

// ── @desc    Register a new user
// ── @route   POST /api/auth/register
// ── @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address } = req.body;

    // Duplicate email check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }

    // Build the user document
    const userData = { name, email, password, phone };

    // Role: only allow CUSTOMER on self-registration; ADMIN sets roles via admin panel
    if (role && role === "SHOP_OWNER") {
      userData.role = "SHOP_OWNER";
    }
    // ADMIN role cannot be self-assigned — silently default to CUSTOMER

    // Address (optional at registration)
    if (address) {
      userData.address = {
        type: "Point",
        coordinates: address.coordinates || [0, 0],
        textAddress:  address.textAddress  || "",
      };
    }

    const user = await User.create(userData);
    const token = generateToken(user._id, user.role);

    res.status(201).json(userPayload(user, token));
  } catch (error) {
    // Mongoose duplicate key (race condition)
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Login — any role
// ── @route   POST /api/auth/login
// ── @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    res.json(userPayload(user, token));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc    Get current logged-in user profile
// ── @route   GET /api/auth/me
// ── @access  Private (any role)
export const getMe = async (req, res) => {
  // req.user is already attached and password-stripped by protect middleware
  res.json(req.user);
};

// ── @desc    Update push notification token
// ── @route   PUT /api/auth/push-token
// ── @access  Private (any role)
export const updatePushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;

    if (!pushToken || typeof pushToken !== "string") {
      return res.status(400).json({ message: "pushToken is required and must be a string" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { pushToken },
      { new: true, select: "-password" }
    );

    res.json({ message: "Push token updated", pushToken: user.pushToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
