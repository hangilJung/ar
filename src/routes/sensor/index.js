const express = require("express");
const router = express.Router();
const pool = require("../../config/config");

router.get("/", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(ip);
  const { place_id, start_date, end_date } = req.body;

  let sql = "select * from sensor where 1 = 1 ";
  let condition = [];

  if (place_id && start_date && end_date) {
    sql += "and place_id = ? and created_at >= ? and created_at <= ?";
    condition.push(place_id);
    condition.push(start_date);
    condition.push(end_date);
  } else if (start_date && end_date) {
    sql += "and created_at >= ? and created_at <= ?";
    condition.push(start_date);
    condition.push(end_date);
  } else {
    sql += "limit 23 ";
  }

  const result = await pool.query(sql, condition);
  res.json(result[0]);
});

//   '/:id 윗줄에 두면 /term  /join 안먹히고 /:id 로 인식

module.exports = router;
