const express = require("express");
const router = express.Router();

const sensor = require("./sensor");
const board = require("./board");
const { domain } = require("./middlewares");

router.use("/sensor", domain, sensor);
router.use("/board", board);

module.exports = router;
