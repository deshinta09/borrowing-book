/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         stock:
 *           type: number
 *           description: The stock of your book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the book was updated
 */
/**
 * @swagger
 * tags:
 *   name: Book
 *   description: The Book managing API
 * /Books:
 *   get:
 *     summary: Lists all the Book
 *     tags: [Book]
 *     responses:
 *       200:
 *         description: The list of the Book
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/books'
 */

const express = require("express");
const BooksController = require("../controller/booksController");
const route = express.Router();

route.get("/books", BooksController.getAllBook);

module.exports = route;
