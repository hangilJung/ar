const pool = require("../../config/config");

class SensorDAO {
  constructor(body) {
    this.body = body;
  }

  async find_all() {
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
        sql += " from sensor where 1 = 1 ";

        if (parameter["place_id"]) {
          sql += " and  place_id = ? ";
          console.log(sql);
          condition.push(parameter.place_id);
        }
        if (where["created_at"]) {
          sql += " and created_at >= ? and created_at <= ?";
          console.log(sql);
          condition.push(where.created_at.gte);
          condition.push(where.created_at.lte);
        }
        if (orderby["standard"]) {
          sql += " order by id desc";
          condition.push(orderby["standard"]);
          condition.push(orderby["sort"]);
        }
      } catch (error) {
        console.log(error);
        return { msg: "연결실패" };
      }
    } else if (orderby["standard"]) {
      sql +=
        " * from sensor order by " +
        orderby["standard"] +
        " " +
        orderby["sort"];
    } else {
      sql += " * from sensor ";
    }
    if (limit["limit"]) {
      sql += " limit ?";
      condition.push(limit["limit"]);
    }
    console.log(sql);
    try {
      const result = await pool.query(sql, condition);
      return result[0];
    } catch (error) {
      console.log(error);
      return { msg: "조회실패" };
    }
  }

  async sensor_find_all_asc() {
    const result = await pool.query("select * from sensor");
    return result[0];
  }

  async test() {
    const result = await pool.query("select * from sensor limit 20");
    return result[0];
  }
}

module.exports = SensorDAO;
