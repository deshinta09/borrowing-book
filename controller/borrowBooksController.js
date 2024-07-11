const { MembersBook } = require("../models/");
class BorrowBooksController {
  static async getBorrowBooks(req, res, next) {
    try {
      let books = await MembersBook.findAll({
        where: { MemberId: req.user.id },
      });
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BorrowBooksController;
