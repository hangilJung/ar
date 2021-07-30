const pool = require("../../config/config");

class BoardDAO {
  constructor(body) {
    this.body = body;
  }

  async record_find_all() {
    const { column, where, parameter, orderby, limit } = this.body;
    let sql = "select ";
    let condition = [];
    if (
      column !== undefined ||
      where !== undefined ||
      parameter !== undefined ||
      orderby !== undefined ||
      limit !== undefined
    ) {
      try {
        if (column.length > 0) {
          sql += column.join(",");
          console.log(sql);
        } else {
          sql += " * ";
        }
        sql += " from disaster_record where 1 = 1 ";

        if (parameter["place_id"]) {
          sql += " and  place_id = ? ";
          console.log(sql);
          condition.push(parameter.place_id);
        }
        if (where["created_at"]) {
          sql += " and created_at > ? and created_at < ?";
          console.log(sql);
          condition.push(where.created_at.gte);
          condition.push(where.created_at.lte);
        }
        if (orderby["standard"]) {
          sql += " order by ? ?";
          condition.push(orderby["standard"]);
          condition.push(orderby["sort"]);
        }
      } catch (error) {
        console.log(error);
        return { msg: "연결실패" };
      }
    } else if (orderby["standard"]) {
      sql += " * from disaster_record order by ? ?";
      condition.push(orderby["standard"]);
      condition.push(orderby["sort"]);
    } else {
      sql += " * from disatser_record ";
    }
    if (limit["limit"]) {
      sql += " limit ?";
      condition.push(limit["limit"]);
    }

    try {
      const result = await pool.query(sql, condition);
      return result[0];
    } catch (error) {
      return { msg: "조회실패" };
    }
  }

  //async await 를 안쓰면 result._options.isNewRecord를 찾지를 못함.
  async record_create() {
    const { title, content, manager_id } = this.body;
    const result = await pool.query(
      "insert into disaster_record (title,content, manager_id) values(?,?,?)",
      [title, content, manager_id]
    );
    if (result[0].affectedRows > 0) {
      return { msg: "record 글쓰기 성공" };
    }
  }

  async record_update() {
    const { title, content, id } = this.body;

    const result = await pool.query(
      "update disaster_record set title = ?, content = ?, updated_at = now() where id = ? ",
      [title, content, id]
    );
    if (result[0].affectedRows > 0) {
      return { msg: "record 글 수정하기 성공" };
    }
  }
  async record_delete() {
    const { id } = this.body;
    const result = await pool.query(
      "delete from disaster_record where id = ?",
      [id]
    );
    if (result[0].affectedRows > 0) {
      return { msg: "record 글 삭제 성공" };
    }
  }

  async safety_find_all() {
    const { column, where, parameter, orderby, limit } = this.body;
    let sql = "select ";
    let condition = [];
    if (
      column !== undefined ||
      where !== undefined ||
      parameter !== undefined ||
      orderby !== undefined ||
      limit !== undefined
    ) {
      try {
        if (column.length > 0) {
          sql += column.join(",");
          console.log(sql);
        } else {
          sql += " * ";
        }
        sql += " from disaster_safety where 1 = 1 ";

        if (parameter["place_id"]) {
          sql += " and  place_id = ? ";
          console.log(sql);
          condition.push(parameter.place_id);
        }
        if (where["created_at"]) {
          sql += " and created_at > ? and created_at < ?";
          console.log(sql);
          condition.push(where.created_at.gte);
          condition.push(where.created_at.lte);
        }
        if (orderby["standard"]) {
          sql += " order by ? ?";
          condition.push(orderby["standard"]);
          condition.push(orderby["sort"]);
        }
      } catch (error) {
        console.log(error);
        return { msg: "연결실패" };
      }
    } else if (orderby["standard"]) {
      sql += " * from disaster_safety order by ? ?";
      condition.push(orderby["standard"]);
      condition.push(orderby["sort"]);
    } else {
      sql += " * from disaster_safety ";
    }
    if (limit["limit"]) {
      sql += " limit ?";
      condition.push(limit["limit"]);
    }

    try {
      const result = await pool.query(sql, condition);
      return result[0];
    } catch (error) {
      return { msg: "조회실패" };
    }
  }

  async safety_create() {
    const { title, content, manager_id } = this.body;
    const result = await pool.query(
      "insert into disaster_safety (title,content, manager_id) values(?,?,?)",
      [title, content, manager_id]
    );
    if (result[0].affectedRows > 0) {
      return { msg: "safety 글쓰기 성공" };
    }
  }

  async safety_update() {
    const { title, content, id } = this.body;

    const result = await pool.query(
      "update disaster_safety set title = ?, content = ?, updated_at = now() where id = ? ",
      [title, content, id]
    );
    if (result[0].affectedRows > 0) {
      return { msg: "safety 글 수정하기 성공" };
    }
  }

  async safety_delete() {
    const { id } = this.body;
    const result = await pool.query(
      "delete from disaster_safety where id = ?",
      [id]
    );
    if (result[0].affectedRows > 0) {
      return { msg: "safety 글 삭제 성공" };
    }
  }
}

module.exports = BoardDAO;
