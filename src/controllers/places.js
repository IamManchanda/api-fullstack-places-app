const uuidv4 = require("uuid/v4");

const HttpError = require("../models/http-error");
let DUMMY_PLACES = require("../data/dummy_places");

/* CREATE */
const createPlace = (req, res, next) => {
  const { title, description, address, creator, location } = req.body;
  const place = {
    id: uuidv4(),
    title,
    description,
    address,
    creator,
    location,
  };
  DUMMY_PLACES.push(place);
  res.status(201).json({ place });
};

/* READ */
const readAllPlaces = (req, res, next) => {
  const places = DUMMY_PLACES;
  if (!places || places.length === 0) {
    return next(new HttpError("Could not find any places.", 404));
  }
  res.status(200).json({ places });
};

const readCurrentPlaceByPlaceId = (req, res, next) => {
  const { placeId } = req.params;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided placeId.", 404),
    );
  }
  res.status(200).json({ place });
};

const readAllPlacesByUserId = (req, res, next) => {
  const { userId } = req.params;
  const places = DUMMY_PLACES.filter(p => p.creator === userId);
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided userId.", 404),
    );
  }
  res.status(200).json({ places });
};

/* UPDATE */
const updateCurrentPlaceByPlaceId = (req, res, next) => {
  const { title, description } = req.body;
  const { placeId } = req.params;
  const place = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  place.title = title;
  place.description = description;

  DUMMY_PLACES[placeIndex] = place;
  res.status(200).json({ place });
};

/* DELETE */
const deleteByPlaceId = (req, res, next) => {
  const { placeId } = req.params;
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(204).json({
    message: `Deleted place for placeId ${placeId}`,
  });
};

exports.createPlace = createPlace;
exports.readAllPlaces = readAllPlaces;
exports.readCurrentPlaceByPlaceId = readCurrentPlaceByPlaceId;
exports.readAllPlacesByUserId = readAllPlacesByUserId;
exports.updateCurrentPlaceByPlaceId = updateCurrentPlaceByPlaceId;
exports.deleteByPlaceId = deleteByPlaceId;
