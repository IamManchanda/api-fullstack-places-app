const express = require("express");
const { check } = require("express-validator");

const createPlaceValidation = [
  check("title")
    .not()
    .isEmpty(),
  check("description").isLength({ min: 5 }),
  check("address")
    .not()
    .isEmpty(),
];

const updateCurrentPlaceByPlaceIdValidation = [
  check("title")
    .not()
    .isEmpty(),
  check("description").isLength({ min: 5 }),
];

exports.createPlaceValidation = createPlaceValidation;
exports.updateCurrentPlaceByPlaceIdValidation = updateCurrentPlaceByPlaceIdValidation;
