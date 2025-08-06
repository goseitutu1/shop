const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const User = require('../models/user');

module.exports = {
  createUser: async function({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(userInput.password)
    ) {
      errors.push({ message: 'Password is required' });
    }
    if (
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ where: { email: userInput.email } });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });
    const createdUser = await user.save();
    return { ...createdUser.dataValues};
  },

  login: async function({ email, password }, req) {
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(password)
    ) {
      errors.push({ message: 'Password is required' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ where: { email: email } });
    if (!existingUser) { 
      const error = new Error('Invalid credentials!');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, existingUser.password);
    if(!isEqual){
      const error = new Error('Invalid credentials!');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign({userId: existingUser.id}, "secretkeyneedstobein.envfile", { expiresIn: '1h' });
    const products = await existingUser.getProducts(); // returns [] if none

    // Map products to shape matching GraphQL schema (and ensure no nulls)
    const mappedProducts = products.map(prod => ({
      id: prod.id.toString(),
      title: prod.title,
      description: prod.description,
      price: prod.price,
      imageUrl: prod.imageUrl,
      user: { id: existingUser.id, name: existingUser.name, email: existingUser.email },
      createdAt: prod.createdAt ? prod.createdAt.toISOString() : null,
      updatedAt: prod.updatedAt ? prod.updatedAt.toISOString() : null
    }));

    return {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        // password is optional in schema; omit or null if you prefer
        products: mappedProducts
      }
  }
}

};