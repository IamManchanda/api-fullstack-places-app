const uuidv4 = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const readLocationFromAddress = require("../utils/location");
let DUMMY_PLACES = require("../data/dummy_places");

/* READ */
const readAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find();
    if (!places || places.length === 0) {
      return next(new HttpError("Could not find any places.", 404));
    }
    res
      .status(200)
      .json({ places: places.map(place => place.toObject({ getters: true })) });
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong. Could not fetch any places. Please try again",
        500,
      ),
    );
  }
};

const readCurrentPlaceByPlaceId = async (req, res, next) => {
  const { placeId } = req.params;
  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return next(
        new HttpError("Could not find a place for the provided placeId.", 404),
      );
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Something went wrong. Could not find a place.", 500),
    );
  }
};

const readAllPlacesByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const places = await Place.find({ creator: userId });
    if (!places || places.length === 0) {
      return next(
        new HttpError("Could not find a place for the provided userId", 404),
      );
    }
    res
      .status(200)
      .json({ places: places.map(place => place.toObject({ getters: true })) });
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong. Could not fetch any places. Please try again",
        500,
      ),
    );
  }
};

/* CREATE */
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid Inputs passed, please check the form data you passed.",
        422,
      ),
    );
  }
  const { title, description, address, creator } = req.body;
  let location;
  try {
    location = await readLocationFromAddress(address);
  } catch (error) {
    return next(error);
  }

  const place = new Place({
    title,
    description,
    address,
    creator,
    location,
    image:
      "https://untappedcities.com/wp-content/uploads/2015/07/Flatiron-Building-Secrets-Roof-Basement-Elevator-Sonny-Atis-GFP-NYC_5.jpg",
  });
  try {
    await place.save();
    res.status(201).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(new HttpError("Creating Place failed, please try again", 500));
  }
};

/* UPDATE */
const updateCurrentPlaceByPlaceId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid Inputs passed, please check the form data you passed.",
        422,
      ),
    );
  }

  const { title, description } = req.body;
  const { placeId } = req.params;

  try {
    const place = await Place.findById(placeId);
    place.title = title;
    place.description = description;
    await place.save();
    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update place.", 500),
    );
  }
};

/* DELETE */
const deleteByPlaceId = (req, res, next) => {
  const { placeId } = req.params;
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    return next(
      new HttpError(
        `Could not find place for the provided placeId: ${placeId}`,
        404,
      ),
    );
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(200).json({
    message: `Deleted place for placeId ${placeId}`,
  });
};

exports.createPlace = createPlace;
exports.readAllPlaces = readAllPlaces;
exports.readCurrentPlaceByPlaceId = readCurrentPlaceByPlaceId;
exports.readAllPlacesByUserId = readAllPlacesByUserId;
exports.updateCurrentPlaceByPlaceId = updateCurrentPlaceByPlaceId;
exports.deleteByPlaceId = deleteByPlaceId;
