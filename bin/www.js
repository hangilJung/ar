const app = require("../app");
const PORT = process.env.PORT || 3200;
const logger = require("../src/config/logger");

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`WEB서버 가동 ${PORT}`);
});
