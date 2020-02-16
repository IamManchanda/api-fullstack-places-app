const express = require("express");

const { readAllUsers, signupUser, loginUser } = require("../controllers/users");
const { signupUserValidation } = require("../validators/users");

const usersRoutes = express.Router();
usersRoutes.get("/", readAllUsers);
usersRoutes.post("/signup", signupUserValidation, signupUser);
usersRoutes.post("/login", loginUser);

module.exports = usersRoutes;
