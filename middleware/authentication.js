const { checkToken } = require("../helpers/jwt");
const { Member } = require("../models/");

module.exports = async function authentication(req, res, next) {
  try {
    let { authorization } = req.headers;
    if (!authorization) {
      throw { name: "Unautorized", message: "Invalid Token" };
    }
    let check = checkToken(authorization.split(" ")[1]);
    if (!check) {
      throw { name: "Unautorized", message: "Invalid Token" };
    }

    let user = await Member.findByPk(check.id);
    if (!user) {
      throw { name: "Unautorized", message: "Invalid Token" };
    }

    req.user = {
      id: user.id,
    };
    next();
  } catch (error) {
    next(error);
  }
};
