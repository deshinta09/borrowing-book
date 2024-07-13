const express = require("express");
const route = express.Router();
const routeBooks = require("./books");
const routeMembers = require("./members");
const routerMembersBooks = require("./membersBook");
// const authentication = require("../middleware/authentication");

route.use(routeMembers);
// route.use(authentication);
route.use(routeBooks);
route.use(routerMembersBooks);

module.exports = route;
