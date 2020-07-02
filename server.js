const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { connect, set } = require("mongoose");

const placesRoutes = require("./src/routes/places");
const usersRoutes = require("./src/routes/users");
const HttpError = require("./src/models/http-error");

const {
  MONGO_DB_FULLSTACK_MERN_APP_CLUSTER: CLUSTER,
  MONGO_DB_FULLSTACK_MERN_APP_USERNAME: USERNAME,
  MONGO_DB_FULLSTACK_MERN_APP_PASSWORD: PASSWORD,
  MONGO_DB_FULLSTACK_MERN_APP_DB_NAME: DB_NAME,
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
  if (res.headerSent) {
    return next(error);
  }
  res.status(typeof error.code === "number" ? error.code : 500);
  res.json({ message: error.message || "An unknown error occurred." });
});

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(function startWebServer() {
    app.listen(process.env.PORT || 5000);
    console.log("API Server listening...");
  })
  .catch(function errorHandlerForBadWebServerStart(error) {
    console.log(error);
  });
set("useCreateIndex", true);
