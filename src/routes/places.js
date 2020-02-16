const express = require("express");

const {
  createPlace,
  readAllPlaces,
  readCurrentPlaceByPlaceId,
  readCurrentPlaceByUserId,
} = require("../controllers/places");

const placesRoutes = express.Router();
placesRoutes.get("/", readAllPlaces);
placesRoutes.get("/:placeId", readCurrentPlaceByPlaceId);
placesRoutes.get("/user/:userId", readCurrentPlaceByUserId);
placesRoutes.post("/", createPlace);

module.exports = placesRoutes;
