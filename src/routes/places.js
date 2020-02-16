const express = require("express");

const {
  readAllPlaces,
  readCurrentPlaceByPlaceId,
  readCurrentPlaceByUserId,
} = require("../controllers/places");

const placesRoutes = express.Router();
placesRoutes.get("/", readAllPlaces);
placesRoutes.get("/:placeId", readCurrentPlaceByPlaceId);
placesRoutes.get("/user/:userId", readCurrentPlaceByUserId);

module.exports = placesRoutes;
