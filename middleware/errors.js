module.exports = function errors(error, req, res, next) {
  let status = 500;
  let message = "Internal Server Error";
  console.log(error, "<< error di function error");
  if (error.name === "Bad Request") {
    status = 404;
    message = error.message;
  }
  res.status(status).json({ message });
};
