const { Member, MembersBook } = require("../models/");
module.exports = async function authorization(req, res, next) {
  try {
    // check jumlah hari setelah pengembalian buku pinalti
    // update status member book ke borrowed
    // check lagi apakah masih ada yang terkena pinalti
    let checkStatus = await MembersBook.findOne({
      where: { MemberId: req.user.id, status: "penalized" },
    });
    if (!checkStatus) {
      next();
    } else {
      throw {
        name: "Forbidden",
        message: "Member is currently being penalized",
      };
    }
  } catch (error) {
    next(error);
  }
};
