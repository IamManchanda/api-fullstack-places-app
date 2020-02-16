const uuidv4 = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
let DUMMY_USERS = require("../data/dummy_users");

const readAllUsers = (req, res, next) => {
  const users = DUMMY_USERS;
  if (!users || users.length === 0) {
    return next(new HttpError("Could not find any users.", 404));
  }
  res.status(200).json({ users });
};

const signupUser = (req, res, next) => {
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
  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser) {
    return next(
      new HttpError("Could not create user, email already exists.", 422),
    );
  }
  const user = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(user);
  res.status(201).json({ user });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find(u => u.email === email);
  if (!user || user.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seems to be incorrect.",
        401,
      ),
    );
  }
  res.status(200).json({ message: "Logged in successfully" });
};

exports.readAllUsers = readAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
