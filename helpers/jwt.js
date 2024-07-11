const jwt = require("jsonwebtoken");
const secret = process.env.secret;

const createToken = (payload = jwt.sign(payload, secret));
const checkToken = (token = jwt.verify(token, secret));

module.exports = { createToken, checkToken };
