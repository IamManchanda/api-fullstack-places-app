const uuidv4 = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
let DUMMY_USERS = require("../data/dummy_users");

const readAllUsers = (req, res, next) => {
  const users = DUMMY_USERS;
  if (!users || users.length === 0) {
    return next(new HttpError("Could not find any users.", 404));
  }
  res.status(200).json({ users });
};

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid Inputs passed, please check the form data you passed.",
        422,
      ),
    );
  }
  const { name, email, password, places } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new HttpError("User already exists, Please login instead.", 422),
      );
    }
    const user = new User({
      name,
      email,
      password,
      image:
        "https://pbs.twimg.com/profile_images/1229678138906402816/pRc5M5-N_400x400.jpg",
      places,
    });
    await user.save();
    res.status(201).json({ user: user.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500),
    );
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.password !== password) {
      return next(
        new HttpError("Invalid Credentials, could not log you in.", 401),
      );
    }
    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500),
    );
  }
};

exports.readAllUsers = readAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
