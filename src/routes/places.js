const express = require("express");

const {
  createPlace,
  readAllPlaces,
  readCurrentPlaceByPlaceId,
  readAllPlacesByUserId,
  updateCurrentPlaceByPlaceId,
  deleteByPlaceId,
} = require("../controllers/places");

const placesRoutes = express.Router();
placesRoutes.get("/", readAllPlaces);
placesRoutes.get("/:placeId", readCurrentPlaceByPlaceId);
placesRoutes.get("/user/:userId", readAllPlacesByUserId);
placesRoutes.post("/", createPlace);
placesRoutes.patch("/:placeId", updateCurrentPlaceByPlaceId);
placesRoutes.delete("/:placeId", deleteByPlaceId);

module.exports = placesRoutes;
