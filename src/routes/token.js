const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./middlewares");
const moment = require("moment");
const logger = require("../config/logger");

router.post("/v1", async (req, res) => {
  logger.info("/token/v1 access");
  const client_secret = req.headers.authorization;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  let response = {
    header: {},
  };
  try {
    const result = await pool.query(
      "select * from domain where client_secret = ?",
      [client_secret]
    );
    console.log(result[0]);

    if (result[0].length > 0) {
      const accessToken = jwt.sign(
        {
          expires_at: moment().add(1, "h").format("YYYY-MM-DD HH:mm:ss"),
          issued_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
          issuer: "coporation sooin",
        }
      );

      response.header = {
        resultCode: "30",
        resultMsg: "TOKEN_ISSUANCE_SUCCESS",
      };
      response.body = {
        accessToken,
        expires_at: "1m",
        // moment().add(1, "h").format("YYYY-MM-DD HH:mm:ss"),
        issued_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      res.json(response);
    } else {
      logger.error("/token/v1 error message: NOT_ALLOW_DOMAIN");
      response.header = { resultCode: "31", resultMsg: "NOT_ALLOW_DOMAIN" };
      res.status(400).json(response);
    }
  } catch (error) {
    logger.error("/token/v1 error message:", error);
    response.header = { resultCode: "32", resultMsg: "REGISTRATION_INQUIRY" };
    res.status(401).json(response);
  }
});

router.post("/test", verifyToken, (req, res) => {
  let response = {
    header: {},
  };
  response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
  response.body = { decoded: req.decoded };
  res.json(response);
});

// router.post("/accessToken", verifyToken, async (req, res) => {
//   const accessToken = jwt.sign(
//     {
//       expires_at: moment().add(1, "h").format("YYYY-MM-DD HH:mm:ss"),
//       issued_at: moment().format("YYYY-MM-DD HH:mm:ss"),
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "1m",
//       issuer: "coporation sooin",
//     }
//   );

//   response.header = {
//     resultCode: "30",
//     resultMsg: "TOKEN_ISSUANCE_SUCCESS",
//   };
//   response.body = { accessToken };

//   res.json(response);
// });

module.exports = router;
