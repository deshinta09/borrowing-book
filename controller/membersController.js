const { checkPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { Member, MembersBook } = require("../models/");
class MembersController {
  // static async login(req, res, next) {
  //   try {
  //     let { email, password } = req.body;

  //     let user = await Member.findOne({ where: { email } });
  //     if (!user) {
  //       throw { name: "Bad Request", message: "Invalid email/password" };
  //     }

  //     let check = checkPassword(password, user.password);
  //     if (!check) {
  //       throw { name: "Bad Request", message: "Invalid email/password" };
  //     }

  //     let access_token = createToken({ id: user.id });
  //     res.status(200).json({ access_token });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // static async register(req, res, next) {
  //   try {
  //     let { name, email, password } = req.body;
  //     let allUser = await Member.findAll();
  //     let num = allUser.length;
  //     if (num.length < 3) {
  //       num.length === 1 ? (num = `00${num}`) : (num = `0${num}`);
  //     }
  //     let code = `M${num}`;
  //     let user = await Member.create({ code, name, email, password });

  //     res.status(201).json({ id: user.id, name: user.name, email: user.email });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async allExistingMembers(req, res, next) {
    try {
      let result = [];
      // get member tanpa menampilkan password beserta include buku yg dipinjam
      let members = await Member.findAll({
        include: {
          model: MembersBook,
        },
        attributes: ["id", "name", "email"],
      });
      // merubah data dgn menampilkan jumlah buku yang dibaca masing masin user
      members.forEach((el) => {
        result.push({
          id: el.id,
          name: el.name,
          email: el.email,
          amount: el.MembersBooks.length,
        });
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MembersController;
