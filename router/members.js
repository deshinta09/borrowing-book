const express = require("express");
const MembersController = require("../controller/membersController");
const route = express.Router();

route.post("/login", MembersController.login);
route.post("/register", MembersController.register);

module.exports = route;
