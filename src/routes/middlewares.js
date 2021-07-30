const pool = require("../config/config");

exports.domain = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const result = await pool.query("select * from domain");

  console.log("도메인" + JSON.stringify(result[0][0].client_secret));
  next();
};
