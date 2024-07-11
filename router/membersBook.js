const express = require("express");
const BorrowBooksController = require("../controller/borrowBooksController");
const route = express.Router();

route.get("/membersBooks", BorrowBooksController.getBorrowBooks);
route.post("/membersBooks", BorrowBooksController.postBorrowBooks);

module.exports = route;
