const express = require("express");
const MembersController = require("../controller/membersController");
const route = express.Router();

route.post("/login", MembersController.login);

module.exports = route;
