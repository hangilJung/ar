const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const moment = require("moment");
// const accessLogStream = require("./src/config/log");
const logger = require("./src/config/logger");
dotenv.config();

let response = {
  header: {},
};
const index = require("./src/routes/index");

app.use(express.static("public"));
app.use(express.json());
app.use(morgan("dev"));
// app.use(morgan("tiny", { stream: logger.stream }));
// app.use(morgan("common", { stream: accessLogStream }));
// if (process.env.NODE_ENV === "production") {
//   app.use(morgan("combined"));
// } else {
//   app.use(
//     morgan(
//       ":method :url :status :response-time ms - :res[content-length] :date[iso]",
//       {
//         stream: accessLogStream,
//       }
//     )
//   );
// }

app.use("/", index);

app.use((req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(ip);

  response.header = {
    resultCode: "03",
    resultMsg: "HTTP_ERROR ",
    receiveMethodAndUrl: `${req.method} ${req.url}`,
  };
  logger.info(`app.js method url error, ${req.method} ${req.url}`);
  res.status(404).json(response);
});

module.exports = app;
