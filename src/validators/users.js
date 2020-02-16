const express = require("express");
const { check } = require("express-validator");

const signupUserValidation = [
  check("name")
    .not()
    .isEmpty(),
  check("email")
    .normalizeEmail()
    .isEmail(),
  check("password").isLength({ min: 6 }),
];

exports.signupUserValidation = signupUserValidation;
