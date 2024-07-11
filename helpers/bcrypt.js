const bcrypt = require("bcryptjs");

const hashedPassword = (password) => bcrypt.hashSync(password, 8);
const checkPassword = (passwordAsli, hashed) =>
  bcrypt.compareSync(passwordAsli, hashed);

module.exports = {
  hashedPassword,
  checkPassword,
};
