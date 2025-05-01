const Product = require('../models/product');
const User = require('../models/user')

exports.addProductToCart = (req, res, next) => {
  const product_id = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  User.findByPk(req.session.user.id)
  .then(user => {
    user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: product_id } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.CartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(product_id);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
  })
  .catch(error => console.log(error))
}

exports.getCart = (req, res, next) => {
  User.findByPk(req.session.user.id)
  .then((user) => {
    user.getCart()
    .then((cart) => {
      if(cart){
        cart.getProducts()
      .then((products) => {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products,
        });
      })
      .catch(error => console.log(error))
      }
      else{
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: [],
        });
      }
    })
    .catch(error => console.log(error))
  })
  .catch((error) => console.log(error))
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
