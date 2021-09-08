const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

exports.verifyToken = (req, res, next) => {
  logger.info("verifyToken access");
  let response = {
    header: {},
  };
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    return next();
  } catch (error) {
    logger.error("verifyToken error message:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json(
        (response.header = {
          resultCode: "33",
          resultMsg: "TOKEN_EXPIRED_ERROR",
        })
      );
    }
    response.header = {
      resultCode: "34",
      resultMsg: "INVALID_TOKEN",
    };

    return res.status(400).json(response);
  }
};
