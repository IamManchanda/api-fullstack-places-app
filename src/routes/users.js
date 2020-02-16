const express = require("express");

const { readAllUsers, signupUser, loginUser } = require("../controllers/users");

const usersRoutes = express.Router();
usersRoutes.get("/", readAllUsers);
usersRoutes.post("/signup", signupUser);
usersRoutes.post("/login", loginUser);

module.exports = usersRoutes;
