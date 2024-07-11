const express = require("express");
const route = express.Router();
const routeBooks = require("./books");
const routeMembers = require("./members");
const routerMembersBooks = require("./membersBook");

route.use(routeMembers);
route.use(routeBooks);
route.use(routerMembersBooks);

module.exports = route;
