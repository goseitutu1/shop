const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middlewares/is-auth')
const productValidator = require('../validators/product')

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/edit-product => GET
router.get('/edit-product/:id', isAuth, adminController.getEditProduct);

// /admin/update-product => GET
router.post('/update-product/:id', isAuth, productValidator, adminController.updateProduct);

// /admin/delete-product => POST
router.post('/delete-product', isAuth, adminController.deleteProduct);

// /admin/add-product => POST
router.post('/add-product', isAuth, productValidator, adminController.postAddProduct);

module.exports = router;
