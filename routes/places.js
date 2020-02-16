const express = require("express");

const DUMMY_PLACES = require("./dummy_data/dummy_places");

const placesRoutes = express.Router();

placesRoutes.get("/", function placesHomeRoute(req, res, next) {
  const places = DUMMY_PLACES;
  res.json({ places });
});

placesRoutes.get("/:placeId", function placesHomeRoute(req, res, next) {
  const { placeId } = req.params;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  res.json({ place });
});

placesRoutes.get("/user/:userId", function placesHomeRoute(req, res, next) {
  const { userId } = req.params;
  const place = DUMMY_PLACES.find(p => p.creator === userId);
  res.json({ place });
});

module.exports = placesRoutes;
