const express = require("express");
const BorrowBooksController = require("../controller/borrowBooksController");
const authorization = require("../middleware/authorization");
const route = express.Router();

route.get("/membersBooks", BorrowBooksController.getAllBorrowedBooks);
route.post(
  "/membersBooks/:BookId",
  authorization,
  BorrowBooksController.postBorrowBooks
);
route.patch("/membersBooks/:BookId", BorrowBooksController.returnBook);

module.exports = route;
