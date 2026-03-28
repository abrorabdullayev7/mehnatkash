// Admin Controller
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'abrorabdullayev862@gmail.com').trim().toLowerCase();

const getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      dashboard: {
        totalOrders,
        totalUsers,
        totalSellers,
        totalBuyers,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payload = { ...req.body };

    if (payload.email) {
      const nextEmail = String(payload.email).trim().toLowerCase();
      // Only the fixed admin email can be used, and admin email cannot be moved to another user.
      if (nextEmail === ADMIN_EMAIL && target.email !== ADMIN_EMAIL) {
        return res.status(400).json({ message: 'Admin email is reserved' });
      }
      if (target.email === ADMIN_EMAIL && nextEmail !== ADMIN_EMAIL) {
        return res.status(400).json({ message: 'Admin email cannot be changed' });
      }
      payload.email = nextEmail;
    }

    if (payload.role) {
      if (payload.role === 'admin' && target.email !== ADMIN_EMAIL) {
        delete payload.role;
      }
      if (target.email === ADMIN_EMAIL) {
        payload.role = 'admin';
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (String(target.email).toLowerCase() === ADMIN_EMAIL) {
      return res.status(400).json({ message: 'Admin account cannot be deleted' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboard,
  getAllOrders,
  getAllUsers,
  updateUser,
  deleteUser
};
