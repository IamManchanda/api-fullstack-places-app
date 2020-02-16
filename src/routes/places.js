const express = require("express");

const {
  getAllPlaces,
  getCurrentPlaceByPlaceId,
  getCurrentPlaceByUserId,
} = require("../controllers/places");

const placesRoutes = express.Router();
placesRoutes.get("/", getAllPlaces);
placesRoutes.get("/:placeId", getCurrentPlaceByPlaceId);
placesRoutes.get("/user/:userId", getCurrentPlaceByUserId);

module.exports = placesRoutes;
