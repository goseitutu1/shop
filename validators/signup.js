const { body } = require("express-validator");

module.exports = [
    body(
        "name",
        "Please enter a valid name."
      )
        .trim()
        .isLength({ min: 3 })
        .isString(),
    body(
        "email",
        "Please enter a valid email."
      )
        .trim()
        .isEmail(),
      body(
        "password",
        "Please enter a password with only numbers and text and at least 5 characters."
      )
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
      body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      })
]
