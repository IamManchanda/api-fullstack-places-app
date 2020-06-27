const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const secretKey = "supersecret_dont_share";

const readAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    if (!users || users.length === 0) {
      return next(new HttpError("Could not find any users.", 404));
    }
    res
      .status(200)
      .json({ users: users.map((user) => user.toObject({ getters: true })) });
  } catch (error) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500),
    );
  }
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
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new HttpError("User already exists, Please login instead.", 422),
      );
    }
    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.path,
      places: [],
    });
    await user.save();
    let token;
    token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      secretKey,
      {
        expiresIn: "1h",
      },
    );
    res.status(201).json({
      user: user.id,
      email: user.email,
      token,
    });
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
    if (!existingUser) {
      return next(
        new HttpError("Invalid Credentials, could not log you in.", 401),
      );
    }
    let isValidPassword = false;
    isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return next(
        new HttpError("Invalid Credentials, could not log you in.", 401),
      );
    }
    let token;
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      secretKey,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({
      userId: existingUser.id,
      email: existingUser.email,
      token,
    });
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500),
    );
  }
};

exports.readAllUsers = readAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
