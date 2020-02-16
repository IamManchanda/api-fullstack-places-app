const uuidv4 = require("uuid/v4");
const HttpError = require("../models/http-error");
let DUMMY_PLACES = require("../data/dummy_places");

/* CREATE */
const createPlace = (req, res, next) => {
  const { title, description, address, creator, location } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    address,
    creator,
    location,
  };

  const place = { ...createdPlace };
  DUMMY_PLACES.push(place);
  res.status(201).json({ place });
};

/* READ */
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
      new HttpError("Could not find a place for the provided placeId.", 404),
    );
  }
  res.json({ place });
};

const readCurrentPlaceByUserId = (req, res, next) => {
  const { userId } = req.params;
  const place = DUMMY_PLACES.find(p => p.creator === userId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided userId.", 404),
    );
  }
  res.json({ place });
};

/* UPDATE */
const updateCurrentPlaceByPlaceId = (req, res, next) => {
  const { title, description } = req.body;
  const { placeId } = req.params;
  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  const place = { ...updatedPlace };
  DUMMY_PLACES[placeIndex] = place;
  res.status(200).json({ place });
};

/* DELETE */
const deleteCurrentPlaceByPlaceId = (req, res, next) => {
  const { placeId } = req.params;
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(204).json({
    message: `Deleted place for placeId ${placeId}`,
  });
};

exports.createPlace = createPlace;
exports.readAllPlaces = readAllPlaces;
exports.readCurrentPlaceByPlaceId = readCurrentPlaceByPlaceId;
exports.readCurrentPlaceByUserId = readCurrentPlaceByUserId;
exports.updateCurrentPlaceByPlaceId = updateCurrentPlaceByPlaceId;
exports.deleteCurrentPlaceByPlaceId = deleteCurrentPlaceByPlaceId;
