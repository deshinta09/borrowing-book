const { Op } = require("sequelize");
const { Books } = require("../models/");
class BooksController {
  static async getAllBook(req, res, next) {
    try {
      let books = await Books.findAll({ where: { stock: { [Op.gt]: 0 } } });
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BooksController;
