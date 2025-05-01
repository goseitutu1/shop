const express = require('express');
const cartController = require('../controllers/cart');
const router = express.Router();
const isAuth = require('../middlewares/is-auth')

router.get('/cart', isAuth, cartController.getCart);
router.post('/cart', isAuth, cartController.addProductToCart);
router.get('/orders', isAuth, cartController.getOrders);
router.get('/checkout', isAuth, cartController.getCheckout);

module.exports = router;
