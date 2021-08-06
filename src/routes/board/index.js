const express = require("express");
const router = express.Router();
const pool = require("../../config/config");

router.post("/record/read", async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.json("record 조회 할 수 없습니다.");
  }
});

router.post("/safety/read", async (req, res) => {
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

router.post("/record/create", async (req, res) => {
  const { title, content, manager_id } = req.body;
  const result = await pool.query(
    "insert into disaster_record (title,content, manager_id) values(?,?,?)",
    [title, content, manager_id]
  );
  console.log(result);
  if (result[0].affectedRows > 0) {
    res.json({ msg: "record 글쓰기 성공" });
  }
});

router.post("/safety/create", async (req, res) => {
  const { title, content, manager_id } = req.body;
  const result = await pool.query(
    "insert into disaster_safety (title,content, manager_id) values(?,?,?)",
    [title, content, manager_id]
  );
  if (result[0].affectedRows > 0) {
    res.json({ msg: "safety 글쓰기 성공" });
  }
});

router.post("/record/update", async (req, res) => {
  const { title, content, id } = req.body;
  let msg = {};

  if (
    typeof title === "string" &&
    typeof content === "string" &&
    typeof id === "number"
  ) {
    const result = await pool.query(
      "update disaster_record set title = ?, content = ?, updated_at = now() where id = ? ",
      [title, content, id]
    );
    console.log(result);
    if (result[0].affectedRows > 0) {
      res.json({ msg: "record 글 수정하기 성공" });
    } else {
      res.json({ msg: "해당하는 id가 없습니다." });
    }
  } else {
    if (typeof title !== "string") {
      msg["titleTypeError"] = "title이 문자열이 아닙니다.";
    }
    if (typeof content !== "string") {
      msg["contentTypeError"] = "content이 문자열이 아닙니다.";
    }
    if (typeof id !== "number") {
      msg["idTypeError"] = "id가 숫자가 아닙니다.";
    }
    res.json(msg);
  }
});

router.post("/safety/update", async (req, res) => {
  const { title, content, id } = req.body;

  const result = await pool.query(
    "update disaster_safety set title = ?, content = ?, updated_at = now() where id = ? ",
    [title, content, id]
  );
  if (result[0].affectedRows > 0) {
    res.json({ msg: "safety 글 수정하기 성공" });
  }
});

router.post("/record/delete", async (req, res) => {
  const { id } = req.body;
  const result = await pool.query("delete from disaster_record where id = ?", [
    id,
  ]);
  if (result[0].affectedRows > 0) {
    res.json({ msg: "record 글 삭제 성공" });
  }
});

router.post("/safety/delete", async (req, res) => {
  const { id } = req.body;
  const result = await pool.query("delete from disaster_safety where id = ?", [
    id,
  ]);
  if (result[0].affectedRows > 0) {
    res.json({ msg: "safety 글 삭제 성공" });
  }
});

module.exports = router;
