const { Op } = require("sequelize");
const { Book } = require("../models/");
class BooksController {
  static async getAllBook(req, res, next) {
    try {
      let books = await Book.findAll({ where: { stock: { [Op.gte]: 1 } } });
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BooksController;
