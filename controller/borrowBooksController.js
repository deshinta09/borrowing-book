const { MembersBook, Books } = require("../models/");
class BorrowBooksController {
  static async getBorrowBooks(req, res, next) {
    try {
      let books = await MembersBook.findAll({
        where: { MemberId: req.user.id },
        include: {
          model: Books,
        },
      });
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }

  static async postBorrowBooks(req, res, next) {
    try {
      let { BookId } = req.params;
      let book = await Books.findByPk(BookId);
      if (!book) {
        throw {
          name: "Not Found",
          message: `Book with id ${BookId} not found`,
        };
      }

      let check = await MembersBook.findAll({
        where: { MemberId: req.user.id, status: "borrowed" },
      });
      if (check.length === 2) {
        throw {
          name: "Forbidden",
          message: "Members may not borrow more than 2 books",
        };
      }

      let updateBooks = await Books.update(
        { stock: book.stock - 1 },
        { where: { id: BookId } }
      );

      if (updateBooks[0] === 1) {
        await MembersBook.create({
          BookId,
          MemberId: req.user.id,
          status: "borrowed",
        });
        res.status(200).json(`Successfully borrowed a book ${book.title}`);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async returnBook(req, res, next) {
    try {
      let { BookId } = req.params;
      // find buku yang akan di kembalikan
      let book = await Books.findByPk(BookId);
      // find buku yg dipinjam
      let membersBook = await MembersBook.findOne({
        where: { MemberId: req.user.id, BookId },
      });
      // check apakan buku yang ada dan yg dipinjam terdapat didatabase
      if (!book || !membersBook) {
        throw {
          name: "Not Found",
          message: `Book with id ${BookId} not found`,
        };
      }
      // check waktu peminjaman apakah lebih dari 7 hari
      // let check = membersBook.createdAt
      let returnBook = await Books.update(
        { stock: book + 1 },
        { where: { id: BookId } }
      );

      if (returnBook[0] === 1) {
        await MembersBook.update(
          { status: "returned" },
          { where: { BookId, MemberId: req.user.id } }
        );
        res.status(200).json(`Successfully returned the book ${book.title}`);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BorrowBooksController;
