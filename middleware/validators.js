const { check } = require("express-validator");
const User = require("../models/user");

exports.userLogin = [
  check("username").not().isEmpty().withMessage("Username cannot be empty"),
  check("password").not().isEmpty().withMessage("Password cannot be empty"),
];

exports.userRegister = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username cannot be empty")
    .custom((value) => {
      return User.findOne({
        where: { username: value },
      }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    }),
  check("password").not().isEmpty().withMessage("Password cannot be empty"),
  check("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Password confirmation cannot be empty")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password did not match"),
];

exports.addTask = [
  check("name").not().isEmpty().withMessage("Task name cannot be empty"),
];
