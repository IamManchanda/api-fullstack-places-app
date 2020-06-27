const express = require("express");

const { readAllUsers, signupUser, loginUser } = require("../controllers/users");
const { signupUserValidation } = require("../validators/users");
const fileUpload = require("../middlewares/file-upload");

const usersRoutes = express.Router();
usersRoutes.get("/", readAllUsers);
usersRoutes.post(
  "/signup",
  fileUpload.single("image"),
  signupUserValidation,
  signupUser,
);
usersRoutes.post("/login", loginUser);

module.exports = usersRoutes;
