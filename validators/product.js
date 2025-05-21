const { check } = require("express-validator");
const Product = require('../models/product');

module.exports = [
    check('title')
      .trim()
      .not().isEmpty().withMessage('Title is required')
      .matches(/^[a-zA-Z0-9][a-zA-Z0-9\s]{2,}$/).withMessage('Title must start with an alphabet or number and be at least 3 characters long')
      .custom(async (value, { req }) => {
        const product = await Product.findOne({ where: { title: value } });
        if (product) {
          if(product.id != req.params.id)
            throw new Error('Title must be unique');
          return true;
        }
        return true;
      }),
    check('imageUrl')
      .trim()
      .not().isEmpty().withMessage('Image URL is required')
      .isURL().withMessage('Invalid image URL')
      .custom((value) => {
        if (!/\.(jpg|jpeg|png|gif|bmp)$/.test(value)) {
          throw new Error('Invalid image URL');
        }
        return true;
      }),
    check('price')
      .trim()
      .not().isEmpty().withMessage('Price is required')
      .isFloat({ gt: 0 }).withMessage('Price must be a valid unsigned numeric value greater than zero'),
    check('description')
      .trim()
      .optional()
      .isLength({ max: 120 }).withMessage('Description must be at most 120 characters long')
      .matches(/^[a-zA-Z0-9\s]*$/).withMessage('Description must contain only alphabets and numbers'),
  ];
