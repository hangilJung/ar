require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.SEQUELIZE_DEV_HOST,
  user: process.env.SEQUELIZE_DEV_USER,
  password: process.env.SEQUELIZE_DEV_PASSWORD,
  database: process.env.SEQUELIZE_DEV_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: "date",
});

// db.connect((err) => {
//   if (err) throw err;
//   console.log("DataBase 연결 성공");
// });

module.exports = pool;
