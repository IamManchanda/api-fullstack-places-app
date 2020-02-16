const HttpError = require("../models/http-error");
const DUMMY_PLACES = require("../data/dummy_places");

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

exports.readAllPlaces = readAllPlaces;
exports.readCurrentPlaceByPlaceId = readCurrentPlaceByPlaceId;
exports.readCurrentPlaceByUserId = readCurrentPlaceByUserId;
