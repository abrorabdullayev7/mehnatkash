// Order Routes
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { auth, admin } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/my-orders', auth, getOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, admin, updateOrderStatus);

module.exports = router;
