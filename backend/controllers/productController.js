// Product Controller
const Product = require('../models/Product');
const allowedCategories = ['telefon', 'elektronika', 'kitoblar', 'kiyim', 'oziq', 'sog'];

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let query = { isActive: true };

    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      query.category = category;
    }

    const minPriceNum = toNumber(minPrice);
    const maxPriceNum = toNumber(maxPrice);
    if (Number.isNaN(minPriceNum) || Number.isNaN(maxPriceNum)) {
      return res.status(400).json({ message: 'Invalid price filters' });
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPriceNum !== undefined) query.price.$gte = minPriceNum;
      if (maxPriceNum !== undefined) query.price.$lte = maxPriceNum;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).limit(100);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? { isActive: true }
      : { seller: req.user.id, isActive: true };

    const products = await Product.find(query).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, oldPrice, category, image, stock, rating } = req.body;
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const priceNum = toNumber(price);
    const oldPriceNum = oldPrice === undefined ? 0 : toNumber(oldPrice);
    const stockNum = stock === undefined ? 100 : toNumber(stock);
    const ratingNum = rating === undefined ? 4.5 : toNumber(rating);

    if (normalizedName.length < 2) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (Number.isNaN(oldPriceNum) || oldPriceNum < 0) {
      return res.status(400).json({ message: 'Invalid oldPrice' });
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({ message: 'Invalid stock' });
    }
    if (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    const product = new Product({
      seller: req.user.id,
      name: normalizedName,
      description,
      price: priceNum,
      oldPrice: oldPriceNum,
      category,
      image,
      stock: stockNum,
      rating: ratingNum
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getMyProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
