const { MembersBook, Books } = require("../models/");
class BorrowBooksController {
  static async getAllBorrowedBooks(req, res, next) {
    try {
      let books = await MembersBook.findAll({
        where: { status: "borrowed" },
        include: { model: Books },
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
      if (book.stock < 1) {
        throw {
          name: "Forbidden",
          message: "Book has been borrowed",
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
        res
          .status(200)
          .json({ message: `Successfully borrowed a book ${book.title}` });
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
      // chek apakah buku yg dipinjam terdpt di database
      if (!book) {
        throw {
          name: "Not Found",
          message: `Book with id ${BookId} not found`,
        };
      }
      // find buku yg dipinjam
      let membersBook = await MembersBook.findOne({
        where: { MemberId: req.user.id, BookId },
      });
      // check apakan buku yang ada dan yg dipinjam terdapat didatabase
      if (!membersBook) {
        throw {
          name: "Not Found",
          message: "The returned book is a book that the member has borrowed",
        };
      }
      // check waktu peminjaman apakah lebih dari 7 hari
      let dateBorrowed = new Date(membersBook.createdAt);
      dateBorrowed = dateBorrowed.getDate();
      let dateNow = new Date();
      dateNow = dateNow.getDate();
      // console.log({ dateBorrowed, dateNow });
      // mengupdate jumlah buku
      let returnBook = await Books.update(
        { stock: book.stock + 1 },
        { where: { id: BookId } }
      );

      if (returnBook[0] === 1) {
        // status disesuaikan dengan aturan pinalti
        let status = dateNow - dateBorrowed > 7 ? "penalized" : "returned";
        await MembersBook.update(
          { status },
          { where: { BookId, MemberId: req.user.id } }
        );
        res.status(200).json({ message: `${book.title} in status ${status}!` });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BorrowBooksController;
