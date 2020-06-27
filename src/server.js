const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const { connect, set } = require("mongoose");

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");
const HttpError = require("./models/http-error");

const {
  MONGO_DB_FULLSTACK_MERN_APP_CLUSTER: CLUSTER,
  MONGO_DB_FULLSTACK_MERN_APP_USERNAME: USERNAME,
  MONGO_DB_FULLSTACK_MERN_APP_PASSWORD: PASSWORD,
} = process.env;

const app = express();
app.use(bodyParser.json());
app.use(function corsHandler(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use(function errorHandlerForNotFoundRequest(req, res, next) {
  throw new HttpError("Could not find this route.", 404);
});
app.use(function errorHandlerForRoutableRequest(error, req, res, next) {
  if (req.file) {
    fs.unlink(req.file.path, function errorHandlerForFileUnlink(err) {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(typeof error.code === "number" ? error.code : 500);
  res.json({ message: error.message || "An unknown error occurred." });
});

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}-vhudb.mongodb.net/userWithPlaces?retryWrites=true&w=majority`;
connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(function startWebServer() {
    app.listen(5000);
    console.log("Server listening on port 5000");
  })
  .catch(function errorHandlerForBadWebServerStart(error) {
    console.log(error);
  });
set("useCreateIndex", true);
