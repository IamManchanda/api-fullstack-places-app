const uuidv4 = require("uuid/v4");
const HttpError = require("../models/http-error");
const DUMMY_PLACES = require("../data/dummy_places");

/* Create */
const createPlace = (req, res, next) => {
  const { title, description, address, creator, location } = req.body;
  const place = { title, description, address, creator, location };
  DUMMY_PLACES.push({ id: uuidv4(), ...place });
  res.status(201).json({ place });
};

/* Read */
const readAllPlaces = (req, res, next) => {
  const places = DUMMY_PLACES;
  if (!places) {
    return next(new HttpError("Could not find any places.", 404));
  }
  res.json({ places });
};

const readCurrentPlaceByPlaceId = (req, res, next) => {
  const { placeId } = req.params;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided `placeId`.", 404),
    );
  }
  res.json({ place });
};

const readCurrentPlaceByUserId = (req, res, next) => {
  const { userId } = req.params;
  const place = DUMMY_PLACES.find(p => p.creator === userId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided `userId`.", 404),
    );
  }
  res.json({ place });
};

exports.createPlace = createPlace;
exports.readAllPlaces = readAllPlaces;
exports.readCurrentPlaceByPlaceId = readCurrentPlaceByPlaceId;
exports.readCurrentPlaceByUserId = readCurrentPlaceByUserId;
