const { Member, MembersBook } = require("../models/");
module.exports = async function authorization(req, res, next) {
  try {
    // check jumlah hari setelah pengembalian buku pinalti
    let { MemberId } = req.body;
    // let checkStatus = await MembersBook.findOne({
    //   where: { MemberId: req.user.id, status: "penalized" },
    // });
    let checkStatus = await MembersBook.findOne({
      where: { MemberId, status: "penalized" },
    });
    // hari ini dikurangi hari waktu status berubah apakah lebih dari 3 hari
    if (
      checkStatus &&
      new Date().getDate() - checkStatus.updatedAt.getDate() > 3
    ) {
      // update status member book ke borrowed
      let check = await MembersBook.update(
        { status: "returned" },
        { where: { id: checkStatus.id } }
      );
    }
    // check lagi apakah masih ada yang terkena pinalti
    // let checkPinalty = await MembersBook.findAll({
    //   where: { MemberId: req.user.id, status: "penalized" },
    // });
    let checkPinalty = await MembersBook.findAll({
      where: { MemberId, status: "penalized" },
    });

    if (!checkPinalty.length) {
      next();
    } else {
      throw {
        name: "Forbidden",
        message:
          "Member is currently being penalized. Member with penalty cannot able to borrow the book for 3 days.",
      };
    }
  } catch (error) {
    next(error);
  }
};
