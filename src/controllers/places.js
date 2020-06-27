const { validationResult } = require("express-validator");
const { startSession } = require("mongoose");

const HttpError = require("../models/http-error");
const readLocationFromAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");

/* READ */
const readAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find();
    if (!places || places.length === 0) {
      return next(new HttpError("Could not find any places.", 404));
    }
    res.status(200).json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
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
    const userWithPlaces = await User.findById(userId).populate("places");
    if (!userWithPlaces || userWithPlaces.length === 0) {
      return next(
        new HttpError("Could not find a place for the provided userId", 404),
      );
    }
    const { places } = userWithPlaces;
    res.status(200).json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
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
    location,
    creator,
    image: req.file.path,
  });
  try {
    const user = await User.findById(creator);
    if (!user) {
      return next(new HttpError("Could not find user for provided id", 500));
    }
    const session = await startSession();
    session.startTransaction();
    await place.save({ session });
    user.places.push(place);
    await user.save({ session });
    await session.commitTransaction();
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
    if (!place) {
      return next(
        new HttpError("Could not find a place for the provided placeId.", 404),
      );
    }
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
const deleteByPlaceId = async (req, res, next) => {
  const { placeId } = req.params;
  try {
    const place = await Place.findById(placeId).populate("creator");

    if (!place) {
      return next(
        new HttpError("Could not find a place for the provided placeId.", 404),
      );
    }

    const session = await startSession();
    session.startTransaction();
    await place.remove({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
    res.status(200).json({
      message: `Deleted place for placeId ${placeId}`,
    });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete the place", 500),
    );
  }
};

exports.createPlace = createPlace;
exports.readAllPlaces = readAllPlaces;
exports.readCurrentPlaceByPlaceId = readCurrentPlaceByPlaceId;
exports.readAllPlacesByUserId = readAllPlacesByUserId;
exports.updateCurrentPlaceByPlaceId = updateCurrentPlaceByPlaceId;
exports.deleteByPlaceId = deleteByPlaceId;
