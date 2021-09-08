const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const logger = require("../config/logger");

router.post("/login", async (req, res) => {
  logger.info("/manager/login access");
  let response = {
    header: {},
  };
  try {
    const { user_id, user_pw } = req.body;

    const result = await pool.query(
      "select * from manager where user_id = ? and user_pw = ?",
      [user_id, user_pw]
    );

    if (result[0].length > 0) {
      response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    } else {
      response.header = {
        resultCode: "10",
        resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
      };
    }
    res.json(response);
  } catch (error) {
    logger.error("manager login error message:", error);
    console.log(error);
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };

    res.status(400).json(response);
  }
});

module.exports = router;
