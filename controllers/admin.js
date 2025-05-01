const Product = require('../models/product');
const User = require('../models/user')
const { validationResult } = require('express-validator')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    oldInput: {
      title: null,
      imageUrl: null,
      price: null,
      description: null
    },
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      oldInput: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      validationErrors: errors.array(),
      errorMessages: [...new Set(errors.array().map((error) => error.msg))] //return array of error meesgaes without duplicate
    });
  }

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    UserId: req.session.user.id
  }).then(result => {
    req.flash('success',[title+' added to product list successfully']);
    res.redirect('/admin/products');
  }).catch(error => console.log(error))
};

exports.getEditProduct = (req, res, next) => {
  const product_id = req.params.id;
  Product.findByPk(product_id)
  .then((product) => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product: product,
      validationErrors: []
    });
  })
  .catch(err => console.log(err));
};

exports.updateProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product_id = req.params.id;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        id: product_id
      },
      validationErrors: errors.array(),
      errorMessages: [...new Set(errors.array().map((error) => error.msg))] //return array of error meesgaes without duplicate
    });
  }
  Product.findByPk(product_id)
  .then((product) => {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save();
  }).then(result => {
    req.flash('success',[title+' updated successfully']);
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const product_id = req.body.id;
  let product_title = '';
  Product.findByPk(product_id)
  .then((product) => {
    product_title = product.title
    return product.destroy();
  }).then(result => {
    req.flash('success',[product_title+' deleted successfully']);
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  User.findByPk(req.session.user.id)
  .then(user => {
    user.getProducts()
    .then(products => {
      res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  })
  .catch(error => console.log(error))
  })
  .catch(error => console.log(error))
};
