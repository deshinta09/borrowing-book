if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const errors = require("./middleware/errors");
const app = express();
const router = require("./router/");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Borrowed Books API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./router/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(router);
app.use(errors);

module.exports = app;
