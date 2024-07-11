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

  static async postBorrowBooks(req, res, next) {
    try {
      let { BookId } = req.params;
      let addBook = await MembersBook.create({
        BookId,
        MemberId: req.user.id,
        status: "borrow",
      });
      res.status(200).json(addBook);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BorrowBooksController;
