const express = require("express");
const router = express.Router();
const pool = require("../../config/config");

router.get("/record", async (req, res) => {
  const { start_date, end_date } = req.body;

  let sql = "select * from disaster_record where 1 = 1 ";
  let condition = [];

  if (start_date && end_date) {
    sql += "and created_at >= ? and created_at <= ?";
    condition.push(start_date);
    condition.push(end_date);
  }

  const result = await pool.query(sql, condition);
  res.json(result[0]);
});

router.get("/safety", async (req, res) => {
  const { start_date, end_date } = req.body;

  let sql = "select * from disaster_record where 1 = 1 ";
  let condition = [];

  if (start_date && end_date) {
    sql += "and created_at >= ? and created_at <= ?";
    condition.push(start_date);
    condition.push(end_date);
  }

  const result = await pool.query(sql, condition);
  res.json(result[0]);
});

router.post("/record", async (req, res) => {
  const { title, content, manager_id } = req.body;
  const result = await pool.query(
    "insert into disaster_record (title,content, manager_id) values(?,?,?)",
    [title, content, manager_id]
  );
  if (result[0].affectedRows > 0) {
    res.json({ msg: "record 글쓰기 성공" });
  }
});

router.post("/safety", async (req, res) => {
  const { title, content, manager_id } = req.body;
  const result = await pool.query(
    "insert into disaster_safety (title,content, manager_id) values(?,?,?)",
    [title, content, manager_id]
  );
  if (result[0].affectedRows > 0) {
    res.json({ msg: "safety 글쓰기 성공" });
  }
});

router.put("/record", async (req, res) => {
  const { title, content, id } = req.body;

  const result = await pool.query(
    "update disaster_record set title = ?, content = ?, updated_at = now() where id = ? ",
    [title, content, id]
  );
  if (result[0].affectedRows > 0) {
    res.json({ msg: "record 글 수정하기 성공" });
  }
});

router.put("/safety", async (req, res) => {
  const { title, content, id } = req.body;

  const result = await pool.query(
    "update disaster_safety set title = ?, content = ?, updated_at = now() where id = ? ",
    [title, content, id]
  );
  if (result[0].affectedRows > 0) {
    res.json({ msg: "safety 글 수정하기 성공" });
  }
});

router.delete("/record", async (req, res) => {
  const { id } = req.body;
  const result = await pool.query("delete from disaster_record where id = ?", [
    id,
  ]);
  if (result[0].affectedRows > 0) {
    res.json({ msg: "record 글 삭제 성공" });
  }
});

router.delete("/safety", async (req, res) => {
  const { id } = req.body;
  const result = await pool.query("delete from disaster_safety where id = ?", [
    id,
  ]);
  if (result[0].affectedRows > 0) {
    res.json({ msg: "safety 글 삭제 성공" });
  }
});

module.exports = router;
