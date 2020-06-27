const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const secretKey = "supersecret_dont_share";

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed, please try again later.");
    }
    const decodedToken = jwt.verify(token, secretKey);
    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    return next(
      new HttpError("Authentication failed, please try again later.", 401),
    );
  }
};

module.exports = checkAuth;
