module.exports = function errors(error, req, res, next) {
  let status = 500;
  let message = "Internal Server Error";
  console.log(error, "<< error di function error");
  if (error.name === "Bad Request") {
    status = 400;
    message = error.message;
  } else if (error.name === "Not Found") {
    status = 404;
    message = error.message;
  } else if (error.name === "Forbidden") {
    status = 403;
    message = error.message;
  } else if (
    error.name === "SequelizeUniqueConstraintError" ||
    error.name === "SequelizeValidationError"
  ) {
    status = 400;
    message = error.errors[0].message;
  } else if (error.name === "Unautorized") {
    status = 401;
    message = error.message;
  } else if (error.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid Token";
  }
  res.status(status).json({ message });
};
