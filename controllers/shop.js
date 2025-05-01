const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  })
  .catch(err => console.log(err)); 
};

exports.getProduct = (req, res, next) => {
  const product_id = req.params.id;
  Product.findByPk(product_id)
  .then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    });
  })
  .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  console.log(req.session.user)
  Product.findAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  })
  .catch(err => console.log(err)); 
};
