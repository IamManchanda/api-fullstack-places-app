const express = require("express");

const placesRoutes = express.Router();

placesRoutes.get("/", function placesHomeRoute(req, res, next) {
  console.log("GET request in places.");
  res.json({
    message: "It works!",
  });
});

module.exports = placesRoutes;
