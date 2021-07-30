const app = require("../app");
const PORT = process.env.PORT || 3200;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`WEB서버 가동 ${PORT}`);
});
