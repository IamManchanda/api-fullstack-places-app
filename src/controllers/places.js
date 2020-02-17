const uuidv4 = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const readLocationFromAddress = require("../util/location");
let DUMMY_PLACES = require("../data/dummy_places");

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
  try {
    const location = await readLocationFromAddress(address);
    /* const place = {
      id: uuidv4(),
      title,
      description,
      address,
      creator,
      location,
    }; */
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
    } catch (error) {
      return next(
        new HttpError("Creating Place failed, please try again", 500),
      );
    }
    res.status(201).json({ place });
  } catch (error) {
    return next(error);
  }
};

/* UPDATE */
const updateCurrentPlaceByPlaceId = (req, res, next) => {
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
