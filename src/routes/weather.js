const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const logger = require("../config/logger");

router.post("/", async (req, res) => {
  logger.info("/weather access");
  const getData = req.body.data;
  const pty = getData[0].obsrValue;
  const reh = getData[1].obsrValue;
  const rn1 = getData[2].obsrValue;
  const t1h = getData[3].obsrValue;
  const uuu = getData[4].obsrValue;
  const vec = getData[5].obsrValue;
  const vvv = getData[6].obsrValue;
  const wsd = getData[7].obsrValue;

  let response = {
    header: {},
  };
  try {
    const result = await pool.query(
      "insert into weather (pty, reh, rn1, t1h, uuu, vec, vvv, wsd) values (?, ?, ?, ?, ?, ?, ?, ?) ",
      [pty, reh, rn1, t1h, uuu, vec, vvv, wsd]
    );

    if (result[0].affectedRows > 0) {
      response.header.resultCode = "00";
      response.header.resultMsg = "NORMAL_SERVICE";
      res.json(response);
    } else {
      response.header.resultCode = "10";
      response.header.resultMsg = "INVALID_REQUEST_PARAMETER_ERROR";
      res.status(400).json(response);
    }
  } catch (error) {
    logger.error("/weather error message:", error);
  }
});

router.post("/read", async (req, res) => {
  let response = {
    header: {},
  };
  try {
    const result = await pool.query(
      "select * from weather where id = (select max(id) as id from weather);"
    );

    response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    response.body = result[0];

    res.json(response);
  } catch (error) {
    logger.error("/weather/read error message:", error);

    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };

    res.status(400).json(response);
  }
});

router.post("/sky", async (req, res) => {
  logger.info("/sky access");
  const { sky, pty } = req.body;

  let response = {
    header: {},
  };
  try {
    const result = await pool.query(
      "insert into sky (created_at, sky, pty) values (now(), ?, ?)",
      [sky, pty]
    );

    if (result[0].affectedRows > 0) {
      response.header.resultCode = "00";
      response.header.resultMsg = "NORMAL_SERVICE";
      res.json(response);
    } else {
      logger.error(
        "/weather/sky error message: INVAID_REQUEST_PARAMETER_ERROR"
      );
      response.header.resultCode = "10";
      response.header.resultMsg = "INVALID_REQUEST_PARAMETER_ERROR";
      res.status(400).json(response);
    }
  } catch (error) {
    logger.error("/weather/sky error message:", error);

    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };

    res.status(400).json(response);
  }
});

module.exports = router;
