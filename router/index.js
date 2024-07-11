const express = require("express");
const route = express.Router();
const routeBooks = require("./books");
const routeMembers = require("./members");

route.use(routeMembers);
route.use(routeBooks);

module.exports = route;
