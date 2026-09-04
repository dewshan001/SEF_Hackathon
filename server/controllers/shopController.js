import Shop from "../models/shopModel.js";

// @desc    Get the logged-in shop owner's shop
// @route   GET /api/shops/mine
// @access  Private/ShopOwner
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

// @desc    Create a shop for the logged-in shop owner
// @route   POST /api/shops
// @access  Private/ShopOwner
export const createShop = async (req, res) => {
  try {
    const existing = await Shop.findOne({ ownerId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already have a shop" });
    }

    const { shopName, contactNumber, location } = req.body;
    const shop = await Shop.create({
      ownerId: req.user._id,
      shopName,
      contactNumber,
      location,
    });
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
