import Cylinder, { CYLINDER_SIZES } from "../models/cylinderModel.js";
import Shop from "../models/shopModel.js";

// ── @desc  Get cylinders for a specific shop (public — available only)
// ── @route GET /api/shops/:shopId/cylinders
// ── @access Public
export const getShopCylinders = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop || !shop.isActive) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const cylinders = await Cylinder.find({ shopId: req.params.shopId })
      .sort({ sizeKg: 1 })
      .lean();

    res.json(cylinders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get a cylinder by ID (public)
// ── @route GET /api/cylinders/:id
// ── @access Public
export const getCylinderById = async (req, res) => {
  try {
    const cylinder = await Cylinder.findById(req.params.id).lean();
    if (!cylinder) return res.status(404).json({ message: "Cylinder not found" });
    res.json(cylinder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get the logged-in owner's cylinders
// ── @route GET /api/owner/cylinders
// ── @access Private/ShopOwner
export const getMyCylinders = async (req, res) => {
  try {
    let shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) {
      shop = await Shop.create({
        ownerId: req.user._id,
        shopName: `${req.user.name || "Gas"}'s Gas Store`,
        contactNumber: req.user.phone || "0771234567",
        address: req.user.address?.textAddress || "Colombo, Sri Lanka",
        location: req.user.address || {
          type: "Point",
          coordinates: [79.8612, 6.9271],
        },
      });
    }

    const cylinders = await Cylinder.find({ shopId: shop._id }).sort({ createdAt: -1 });
    res.json(cylinders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Add a cylinder to the owner's shop
// ── @route POST /api/owner/cylinders
// ── @access Private/ShopOwner
export const createCylinder = async (req, res) => {
  try {
    let shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) {
      shop = await Shop.create({
        ownerId: req.user._id,
        shopName: `${req.user.name || "Gas"}'s Gas Store`,
        contactNumber: req.user.phone || "0771234567",
        address: req.user.address?.textAddress || "Colombo, Sri Lanka",
        location: req.user.address || {
          type: "Point",
          coordinates: [79.8612, 6.9271],
        },
      });
    }

    const { sizeKg, gasType = "Litro", price, availableQuantity, description } = req.body;

    // Validate size
    if (!CYLINDER_SIZES.includes(sizeKg)) {
      return res.status(400).json({
        message: `Invalid cylinder size. Must be one of: ${CYLINDER_SIZES.join(", ")}`,
      });
    }

    // Check if cylinder with same size & gas type already exists for this shop
    let cylinder = await Cylinder.findOne({
      shopId: shop._id,
      sizeKg,
      gasType,
    });

    if (cylinder) {
      // Update existing cylinder
      cylinder.price = Number(price);
      cylinder.availableQuantity = Number(availableQuantity) || 0;
      if (capacityLitres !== undefined && capacityLitres !== null) {
        cylinder.capacityLitres = capacityLitres !== "" ? Number(capacityLitres) : null;
      }
      if (description !== undefined) cylinder.description = description;
      await cylinder.save();
      return res.status(200).json(cylinder);
    }

    cylinder = await Cylinder.create({
      shopId: shop._id,
      sizeKg,
      gasType,
      capacityLitres: capacityLitres ? Number(capacityLitres) : null,
      price: Number(price),
      availableQuantity: Number(availableQuantity) || 0,
      description: description || "",
    });

    res.status(201).json(cylinder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A cylinder with this size and gas type already exists in your inventory.",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Update a cylinder owned by this owner
// ── @route PATCH /api/owner/cylinders/:id
// ── @access Private/ShopOwner
export const updateCylinder = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const cylinder = await Cylinder.findOne({ _id: req.params.id, shopId: shop._id });
    if (!cylinder) return res.status(404).json({ message: "Cylinder not found" });

    const { sizeKg, gasType, capacityLitres, price, availableQuantity, description } = req.body;

    if (sizeKg !== undefined) {
      if (!CYLINDER_SIZES.includes(sizeKg)) {
        return res.status(400).json({ message: `Invalid size. Must be: ${CYLINDER_SIZES.join(", ")}` });
      }
      cylinder.sizeKg = sizeKg;
    }
    if (gasType !== undefined) cylinder.gasType = gasType;
    if (capacityLitres !== undefined) cylinder.capacityLitres = capacityLitres;
    if (price !== undefined) cylinder.price = Number(price);
    if (availableQuantity !== undefined) cylinder.availableQuantity = Math.max(0, Number(availableQuantity));
    if (description !== undefined) cylinder.description = description;

    await cylinder.save();
    res.json(cylinder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A cylinder with this size and gas type already exists." });
    }
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Update stock quantity only
// ── @route PATCH /api/owner/cylinders/:id/stock
// ── @access Private/ShopOwner
export const updateCylinderStock = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const { availableQuantity } = req.body;
    if (availableQuantity === undefined || Number(availableQuantity) < 0) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    const cylinder = await Cylinder.findOneAndUpdate(
      { _id: req.params.id, shopId: shop._id },
      { availableQuantity: Math.max(0, Number(availableQuantity)) },
      { new: true }
    );
    if (!cylinder) return res.status(404).json({ message: "Cylinder not found" });

    res.json(cylinder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Delete a cylinder owned by this owner
// ── @route DELETE /api/owner/cylinders/:id
// ── @access Private/ShopOwner
export const deleteCylinder = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const cylinder = await Cylinder.findOneAndDelete({ _id: req.params.id, shopId: shop._id });
    if (!cylinder) return res.status(404).json({ message: "Cylinder not found" });

    res.json({ message: "Cylinder removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
