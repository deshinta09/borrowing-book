/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the member
 *         name:
 *           type: string
 *           description: The name of your member
 *         email:
 *           type: string
 *           description: The email of your member
 *         amount:
 *           type: number
 *           description: The amount book of your member
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
 *   name: Member
 *   description: The Member managing API
 * /members:
 *   get:
 *     summary: Lists all the Member
 *     tags: [Member]
 *     responses:
 *       200:
 *         description: The list of the Member
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/members'
 */

const express = require("express");
const MembersController = require("../controller/membersController");
// const authentication = require("../middleware/authentication");
const route = express.Router();

// route.post("/login", MembersController.login);
// route.post("/register", MembersController.register);
route.get("/members", MembersController.allExistingMembers);

module.exports = route;
