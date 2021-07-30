const pool = require("../../config/config");

class ManagerDAO {
  constructor(body) {
    this.body = body;
  }

  async find_all() {
    {
      const { column, where, parameter } = this.body;
      let sql = "select ";
      let condition = [];

      try {
        if (column.length > 0) {
          sql += column + " from manager ";
          console.log(sql);
        } else {
          sql += "* from manager ";
        }
        if (Object.keys(parameter).length > 0) {
          sql += "where id = ? ";
          console.log(sql);
          condition.push(parameter.id);

          if (Object.keys(where).length > 0) {
            sql += "and created_at >= ? and created_at <= ?";
            console.log(sql);
            condition.push(where.created_at.gte);
            condition.push(where.created_at.lte);
          }
        } else if (Object.keys(where).length > 0) {
          sql += "where created_at >= ? and created_at <= ?";
          console.log(sql);
          condition.push(where.created_at.gte);
          condition.push(where.created_at.lte);
        }
      } catch (error) {
        console.log("에러");
        return { msg: "연결실패" };
      }
      console.log(sql);
      const result = await pool.query(sql, condition);
      return result[0];
    }
  }
}

module.exports = ManagerDAO;
