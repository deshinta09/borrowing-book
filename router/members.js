const express = require("express");
const MembersController = require("../controller/membersController");
const authentication = require("../middleware/authentication");
const route = express.Router();

route.post("/login", MembersController.login);
route.post("/register", MembersController.register);
route.get("/members", authentication, MembersController.allExistingMembers);

module.exports = route;
