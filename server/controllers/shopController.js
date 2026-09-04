import Shop from "../models/shopModel.js";

// ── @desc  Get all active shops (public)
// ── @route GET /api/shops
// ── @access Public
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true })
      .select("-__v")
      .sort({ shopName: 1 });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get a single shop by ID (public)
// ── @route GET /api/shops/:id
// ── @access Public
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).select("-__v");
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Get the logged-in shop owner's shop
// ── @route GET /api/shops/mine
// ── @access Private/ShopOwner
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: "No shop found for this account" });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Create a shop for the logged-in shop owner
// ── @route POST /api/shops
// ── @access Private/ShopOwner
export const createShop = async (req, res) => {
  try {
    const existing = await Shop.findOne({ ownerId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already have a shop" });
    }

    const { shopName, contactNumber, address, location } = req.body;
    const shop = await Shop.create({
      ownerId: req.user._id,
      shopName,
      contactNumber,
      address: address || "",
      location: location || { type: "Point", coordinates: [0, 0] },
    });
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @desc  Update the logged-in shop owner's shop
// ── @route PATCH /api/shops/mine
// ── @access Private/ShopOwner
export const updateMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const { shopName, contactNumber, address, location } = req.body;
    if (shopName !== undefined) shop.shopName = shopName;
    if (contactNumber !== undefined) shop.contactNumber = contactNumber;
    if (address !== undefined) shop.address = address;
    if (location !== undefined) shop.location = location;

    await shop.save();
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
