// Product Routes
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { auth, admin, sellerOrAdmin } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/my/listings', auth, sellerOrAdmin, getMyProducts);
router.get('/:id', getProduct);
router.post('/', auth, sellerOrAdmin, createProduct);
router.put('/:id', auth, admin, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;
