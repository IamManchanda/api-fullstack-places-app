const express = require("express");

const {
  createPlace,
  readAllPlaces,
  readCurrentPlaceByPlaceId,
  readAllPlacesByUserId,
  updateCurrentPlaceByPlaceId,
  deleteByPlaceId,
} = require("../controllers/places");
const {
  createPlaceValidation,
  updateCurrentPlaceByPlaceIdValidation,
} = require("../validators/places");
const fileUpload = require("../middlewares/file-upload");

const placesRoutes = express.Router();
placesRoutes.get("/", readAllPlaces);
placesRoutes.get("/:placeId", readCurrentPlaceByPlaceId);
placesRoutes.get("/user/:userId", readAllPlacesByUserId);
placesRoutes.post(
  "/",
  fileUpload.single("image"),
  createPlaceValidation,
  createPlace,
);
placesRoutes.patch(
  "/:placeId",
  updateCurrentPlaceByPlaceIdValidation,
  updateCurrentPlaceByPlaceId,
);
placesRoutes.delete("/:placeId", deleteByPlaceId);

module.exports = placesRoutes;
