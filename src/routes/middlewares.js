const pool = require("../config/config");
const jwt = require("jsonwebtoken");

exports.domain = async (req, res, next) => {
  const result = await pool.query("select * from domain");

  console.log("도메인" + JSON.stringify(result[0]));
  next();
};

exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    console.log(req.headers.authorization);
    //rq.headers.authorization 을 split(" ")로 나눈 이유는 console.log로 찍어보면 Bearer fmsadkjf;snakl 이런 형식으로 bearer가 찍히기 때문.

    return next();
  } catch (error) {
    console.log(Object.keys(error));
    console.log(Object.values(error));
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.json({
        msg: "토큰이 만료되었습니다.",
      });
    }
  }
  return res.json({ msg: "유효하지않은 토큰입니다." });
};
