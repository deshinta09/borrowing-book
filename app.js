const express = require("express");
const errors = require("./middleware/errors");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(errors());

app.listen(port, () => console.log(`listen on port ${port}...`));
