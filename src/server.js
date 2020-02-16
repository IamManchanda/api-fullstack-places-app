const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");
const HttpError = require("./models/http-error");

const app = express();
app.use(bodyParser.json());
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use(function errorHandlerForNotFoundRequest(req, res, next) {
  throw new HttpError("Could not find this route.", 404);
});
app.use(function errorHandlerForRoutableRequest(error, req, res, next) {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred." });
});
app.listen(5000);
console.log("Server listening on port 5000");
