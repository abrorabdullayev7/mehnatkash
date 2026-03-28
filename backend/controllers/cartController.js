// Cart Controller
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const loadCartWithProducts = async (userId) => {
  return Cart.findOne({ user: userId }).populate('items.product');
};

const getCart = async (req, res) => {
  try {
    let cart = await loadCartWithProducts(req.user.id);
    if (!cart) {
      cart = new Cart({ user: req.user.id });
      await cart.save();
      cart = await loadCartWithProducts(req.user.id);
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const safeQuantity = Number(quantity || 1);
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }
    if (!Number.isInteger(safeQuantity) || safeQuantity <= 0) {
      return res.status(400).json({ message: 'quantity must be a positive integer' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => String(item.product) === String(productId));

    if (existingItem) {
      existingItem.quantity += safeQuantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        quantity: safeQuantity
      });
    }

    // Calculate total
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    cart = await loadCartWithProducts(req.user.id);

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const safeQuantity = Number(quantity);
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }
    if (!Number.isInteger(safeQuantity) || safeQuantity < 0) {
      return res.status(400).json({ message: 'quantity must be 0 or positive integer' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => String(item.product) === String(productId));
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    item.quantity = safeQuantity;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(item => String(item.product) !== String(productId));
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    cart = await loadCartWithProducts(req.user.id);

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => String(item.product) !== String(productId));
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    cart = await loadCartWithProducts(req.user.id);

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    cart = await loadCartWithProducts(req.user.id);

    res.json({ success: true, message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart
};
