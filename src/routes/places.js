const express = require("express");

const HttpError = require("../models/http-error");
const DUMMY_PLACES = require("./dummy_data/dummy_places");

const placesRoutes = express.Router();

placesRoutes.get("/", function allPlacesRoute(req, res, next) {
  const places = DUMMY_PLACES;
  if (!places) {
    return next(new HttpError("Could not find any places.", 404));
  }
  res.json({ places });
});

placesRoutes.get("/:placeId", function placeByPlaceIdRoute(req, res, next) {
  const { placeId } = req.params;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided `placeId`.", 404),
    );
  }
  res.json({ place });
});

placesRoutes.get("/user/:userId", function placeByUserIdRoute(req, res, next) {
  const { userId } = req.params;
  const place = DUMMY_PLACES.find(p => p.creator === userId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided `userId`.", 404),
    );
  }
  res.json({ place });
});

module.exports = placesRoutes;
