const express = require("express");
const BooksController = require("../controller/booksController");
const route = express.Router();

route.get("/books", BooksController.getAllBook);

module.exports = route;
