const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const index = require("./src/routes/index");

app.use(express.json());
app.use(morgan("dev"));

app.use("/", index);

module.exports = app;
