/**
 * @swagger
 * components:
 *   schemas:
 *     MembersBook:
 *       type: object
 *       required:
 *         - MemberId
 *         - BookId
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the member book
 *         MemberId:
 *           type: number
 *           description: The MemberId of your member book
 *         BookId:
 *           type: number
 *           description: The BookId of your member book
 *         status:
 *           type: string
 *           description: The stock of your member book
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
 *   name: MembersBook
 *   description: The MembersBook managing API
 * /membersBooks:
 *   get:
 *     summary: Lists all the MembersBook
 *     tags: [MembersBook]
 *     responses:
 *       200:
 *         description: The list of the MembersBook
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MembersBook'
 *   post:
 *     summary: Create a new MembersBook
 *     tags: [MembersBook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembersBook'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembersBook'
 *       500:
 *         description: Internal Server Error
 *   patch:
 *    summary: Update the MembersBook by the id
 *    tags: [MembersBook]
 *    parameters:
 *      - in: path
 *        name: BookId
 *        schema:
 *          type: number
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MembersBook'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MembersBook'
 *      404:
 *        description: Book with id ${BookId} not found
 *      500:
 *        description: Internal Server Error
 */

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
