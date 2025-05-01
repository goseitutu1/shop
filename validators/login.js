const { body } = require("express-validator");

module.exports = [
    body(
        "email",
        "Please enter a valid email."
      )
        .trim()
        .isEmail(),
      body(
        "password",
        "Please password field is required a password."
      )
        .trim()
        .notEmpty({ min: 5 })
]
