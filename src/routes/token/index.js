const express = require("express");
const router = express.Router();
const pool = require("../../config/config");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares");

router.post("/v1", async (req, res) => {
  const { client_secret } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    const result = await pool.query(
      "select * from domain where client_secret = ?",
      [client_secret]
    );
    console.log("ip값은?" + ip);
    console.log(result[0][0].host);
    console.log(result[0][0].client_secret);

    if (result[0][0].host === ip) {
      const token = jwt.sign(
        {
          id: result[0][0].id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "5m",
          issuer: "hg",
        }
      );
      console.log(token);
      res.json({
        msg: "토큰 발급 완료",
        token,
      });
    } else {
      res.json({ msg: "허용한 도메인이 아닙니다." });
    }
  } catch (error) {
    return res.json({
      msg: "등록되지 않은 도메인 입니다. 먼저 도메인을 등록 문의를 해주세요.",
    });
  }
});

router.post("/test", verifyToken, (req, res) => {
  console.log("테스트 작동");
  res.json(req.decoded);
});

module.exports = router;
