const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
// const ModbusRTU = require("modbus-serial");
// const client = new ModbusRTU();
// const pool = require("./src/config/config");

// client.connectTCP("192.168.0.48", { port: 502 });
// client.setID(1);

// setInterval(function () {
//   client.readHoldingRegisters(0, 10, function (err, data) {
//     const get_data = data.data;
//     console.log(get_data);
//     pool.query(
//       "insert into sensor (place_id, precipitation, water_level, temperature, humidity) values (1, ?, ?, ?, 12)",
//       [get_data[1], get_data[2], get_data[3]]
//     );
//   });
// }, 5000);

dotenv.config();

const index = require("./src/routes/index");

app.use(express.json());
app.use(morgan("dev"));

app.use("/", index);

app.use((req, res) => {
  res.status(404).json({
    msg: "요청하신 주소를 찾을 수 없습니다.",
    receiveMethodAndUrl: `${req.method} ${req.url}`,
  });
});

module.exports = app;
