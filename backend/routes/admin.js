// Admin Routes
const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAllOrders,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { auth, admin } = require('../middleware/auth');

router.get('/dashboard', auth, admin, getDashboard);
router.get('/orders', auth, admin, getAllOrders);
router.get('/users', auth, admin, getAllUsers);
router.put('/users/:id', auth, admin, updateUser);
router.delete('/users/:id', auth, admin, deleteUser);

module.exports = router;
