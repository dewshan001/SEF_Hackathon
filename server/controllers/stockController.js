import Stock from "../models/stockModel.js";
import Shop from "../models/shopModel.js";

// @desc    Get all available stock (public browse list)
// @route   GET /api/stocks
// @access  Public
export const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ quantity: { $gt: 0 } })
      .populate("shopId", "shopName contactNumber location isActive")
      .sort({ createdAt: -1 });

    const result = stocks
      .filter((s) => s.shopId?.isActive !== false)
      .map((s) => {
        const obj = s.toJSON();
        obj.shop = s.shopId
          ? {
              _id: s.shopId._id,
              shopName: s.shopId.shopName,
              contactNumber: s.shopId.contactNumber,
              location: s.shopId.location,
            }
          : null;
        return obj;
      });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the logged-in shop owner's own stock
// @route   GET /api/stocks/mine
// @access  Private/ShopOwner
export const getMyStocks = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.json([]);

    const stocks = await Stock.find({ shopId: shop._id }).sort({ createdAt: -1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a stock entry for the logged-in shop owner's shop
// @route   POST /api/stocks
// @access  Private/ShopOwner
export const createStock = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) {
      return res.status(400).json({ message: "Create your shop before adding stock" });
    }

    const { brand, size, quantity, price } = req.body;
    const stock = await Stock.create({ shopId: shop._id, brand, size, quantity, price });
    res.status(201).json(stock);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already have a stock entry for this brand and size" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a stock entry owned by the logged-in shop owner
// @route   PUT /api/stocks/:id
// @access  Private/ShopOwner
export const updateStock = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const stock = await Stock.findOne({ _id: req.params.id, shopId: shop._id });
    if (!stock) return res.status(404).json({ message: "Stock entry not found" });

    const { brand, size, quantity, price } = req.body;
    if (brand !== undefined) stock.brand = brand;
    if (size !== undefined) stock.size = size;
    if (quantity !== undefined) stock.quantity = quantity;
    if (price !== undefined) stock.price = price;

    await stock.save();
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a stock entry owned by the logged-in shop owner
// @route   DELETE /api/stocks/:id
// @access  Private/ShopOwner
export const deleteStock = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const stock = await Stock.findOneAndDelete({ _id: req.params.id, shopId: shop._id });
    if (!stock) return res.status(404).json({ message: "Stock entry not found" });

    res.json({ message: "Stock entry removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
