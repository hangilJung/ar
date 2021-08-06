const express = require("express");
const router = express.Router();

const sensor = require("./sensor");
const board = require("./board");
const token = require("./token");
const manager = require("./manager");

router.use("/sensor", sensor);
router.use("/board", board);
router.use("/token", token);
router.use("/manager", manager);

module.exports = router;
