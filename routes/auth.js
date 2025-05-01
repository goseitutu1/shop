const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const isAuth = require('../middlewares/is-auth')
const signupValidator = require('../validators/signup')
const loginValidator = require('../validators/login')

router.get('/login', authController.getLogin);
router.post('/login', loginValidator, authController.postLogin);
router.post('/logout', isAuth, authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', signupValidator, authController.postSignup);

module.exports = router