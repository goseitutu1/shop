const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    oldInput: {
      email: null,
      password: null,
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
      errorMessages: [...new Set(errors.array().map((error) => error.msg))] //return array of error meesgaes without duplicate
    });
  }
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch){
              return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                oldInput: {
                  email: email,
                  password: password,
                },
                validationErrors: [],
                errorMessages: ['Invald credentials'] //return array of error meesgaes without duplicate
              });
            }
            else {
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.session.save((error) => {
                console.log(error);
                req.flash('success', ['Logged In Successfully']);
                res.redirect("/");
              });
            }
          })
          .catch((error) => console.log(error));
      } else {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
          errorMessages: ['Invald credentials'] //return array of error meesgaes without duplicate
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: '/signup',
      pageTitle: 'Signup',
      oldInput: {
        name: null,
        email: null,
        password: null,
        confirmPassword: null
      },
      validationErrors: []
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      oldInput: {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      },
      validationErrors: errors.array(),
      errorMessages: [...new Set(errors.array().map((error) => error.msg))] //return array of error meesgaes without duplicate
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      User.create({
        name: name,
        email: email,
        password: hashedPassword,
      })
        .then((result) => {
          req.session.isLoggedIn = true;
          req.session.user = result.dataValues;
          req.session.save((error) => {
            console.log(error);
            req.flash('success', ['Signed Up Successfully']);
            return res.redirect("/");
          });
        })
        .catch((error) => {
          error_message = "An error occured";
          if (error.name == "SequelizeUniqueConstraintError")
            error_message = "Email already exists.";

          return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            oldInput: {
              name: name,
              email: email,
              password: password,
              confirmPassword: confirmPassword
            },
            validationErrors: errors.array(),
            errorMessages: [error_message]
          });
        });
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect("/");
  });
};
