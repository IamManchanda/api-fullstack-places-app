const express = require("express");
const { check } = require("express-validator");

const {
  createPlace,
  readAllPlaces,
  readCurrentPlaceByPlaceId,
  readAllPlacesByUserId,
  updateCurrentPlaceByPlaceId,
  deleteByPlaceId,
} = require("../controllers/places");

const createPlaceValidation = [
  check("title")
    .not()
    .isEmpty(),
  check("description").isLength({ min: 5 }),
  check("address")
    .not()
    .isEmpty(),
];

const placesRoutes = express.Router();
placesRoutes.get("/", readAllPlaces);
placesRoutes.get("/:placeId", readCurrentPlaceByPlaceId);
placesRoutes.get("/user/:userId", readAllPlacesByUserId);
placesRoutes.post("/", createPlaceValidation, createPlace);
placesRoutes.patch("/:placeId", updateCurrentPlaceByPlaceId);
placesRoutes.delete("/:placeId", deleteByPlaceId);

module.exports = placesRoutes;
