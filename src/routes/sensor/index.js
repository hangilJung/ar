const express = require("express");
const router = express.Router();
const pool = require("../../config/config");

router.post("/", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(ip);
  const { place_id, start_date, end_date, orderby_column, limit } = req.body;
  console.log("start_date값은?" + start_date);
  console.log("enddate값은?" + end_date);
  console.log("limit 값은?" + limit);

  let sql = "select * from sensor where 1 = 1 ";
  let condition = [];

  if (place_id && start_date && end_date) {
    sql += "and place_id = ? and created_at >= ? and created_at < ?";
    condition.push(place_id);
    condition.push(start_date);
    condition.push(end_date);
    if (orderby_column === "created_at") {
      sql += " order by created_at";
    } else if (orderby_column === "id") {
      sql += " order by id";
    } else {
      sql += " order by id";
    }
    if (limit) {
      sql += " limit ?";
      condition.push(limit);
    }
  } else if (start_date && end_date) {
    sql += "and created_at >= ? and created_at < ?";
    condition.push(start_date);
    condition.push(end_date);
    if (orderby_column === "created_at") {
      sql += " order by created_at";
    } else if (orderby_column === "id") {
      sql += " order by id";
    } else {
      sql += " order by id";
    }
    if (limit) {
      sql += " limit ?";
      condition.push(limit);
    }
  } else {
    sql += "limit 23 ";
  }

  const result = await pool.query(sql, condition);
  res.json(result[0]);
});

router.post("/desc", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(ip);
  const { place_id, start_date, end_date, orderby_column, limit } = req.body;

  let sql = "select * from sensor where 1 = 1 ";
  let condition = [];

  if (place_id && start_date && end_date) {
    sql += "and place_id = ? and created_at >= ? and created_at < ?";
    condition.push(place_id);
    condition.push(start_date);
    condition.push(end_date);

    if (orderby_column === "created_at") {
      sql += " order by created_at desc";
    } else if (orderby_column === "id") {
      sql += " order by id desc";
    } else {
      sql += " order by id desc";
    }

    if (limit) {
      sql += " limit ?";
      condition.push(limit);
    }
  } else if (start_date && end_date) {
    sql += "and created_at >= ? and created_at < ?";
    condition.push(start_date);
    condition.push(end_date);
    if (orderby_column === "created_at") {
      sql += " order by created_at desc";
    } else if (orderby_column === "id") {
      sql += " order by id desc";
    } else {
      sql += " order by id desc";
    }

    if (limit) {
      sql += " limit ?";
      condition.push(limit);
    }
  } else {
    sql += "order by id desc limit 23";
  }

  const result = await pool.query(sql, condition);
  console.log(result);
  res.json(result[0]);
});

//   '/:id 윗줄에 두면 /term  /join 안먹히고 /:id 로 인식

module.exports = router;
