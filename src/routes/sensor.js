const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const moment = require("moment");
const { verifyToken } = require("./middlewares");
const logger = require("../config/logger");

router.post("/", async (req, res) => {
  logger.info("/sensor access");
  const { place_id, start_date, orderby_column, limit } = req.body;

  const sort = req.body.sort ? req.body.sort : "asc";

  let { end_date } = req.body;
  end_date = moment(end_date).add(1, "days").format("YYYY-MM-DD");
  let response = {
    header: {},
  };

  if (
    moment(start_date).format("YYYYMMDD") === "Invalid date" ||
    moment(end_date).format("YYYYMMDD") === "Invalid date" ||
    Number(moment(start_date).format("YYYYMMDD")) >
      Number(moment(end_date).format("YYYYMMDD"))
  ) {
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }

  try {
    let sql = "select * from sensor where 1 = 1";
    let condition = [];

    //날짜 자릿수 검사
    const yyyymmddDateRegExp = /^([\d]{4})-([\d]{2})-([\d]{2})$/;

    if (place_id) {
      sql += " and place_id = ?";
      condition.push(place_id);
    }
    if (
      yyyymmddDateRegExp.test(start_date) &&
      yyyymmddDateRegExp.test(end_date)
    ) {
      if (start_date && end_date) {
        sql += " and created_at >= ? and created_at < ?";
        condition.push(start_date);
        condition.push(end_date);
      }
    }

    if (orderby_column === "created_at") {
      sql += ` order by created_at ${sort}`;
    } else {
      sql += ` order by id ${sort}`;
    }
    if (limit) {
      sql += " limit ? ";
      condition.push(limit);
    }
    const result = await pool.query(sql, condition);

    response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    response.body = result[0];

    res.json(response);
  } catch (error) {
    logger.error("/sensor url error message:", error);
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
});

// router.post("/watch", async (req, res) => {
//   logger.info("/sensor/watch access");
//   const { place_id, start_date } = req.body;

//   let { end_date } = req.body;
//   end_date = moment(end_date).add(1, "days").format("YYYY-MM-DD");

//   let response = {
//     header: {},
//   };

//   try {
//     let sql = "select * from sensor where 1 =1";
//     let condition = [];

//     const yyyymmddDateRegExp = /^([\d]{4})-([\d]{2})-([\d]{2})$/;

//     if (place_id) {
//       sql += " and place_id = ?";
//       condition.push(place_id);
//     }

//     if (
//       yyyymmddDateRegExp.test(start_date) &&
//       yyyymmddDateRegExp.test(end_date)
//     ) {
//       if (start_date && end_date) {
//         sql += " and created_at >= ? and created_at < ? limit 1";
//         condition.push(start_date);
//         condition.push(end_date);
//       }
//     }
//     const result = await pool.query(sql, condition);
//     response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
//     response.body = result[0];

//     if (place_id) {
//       if (result[0][0].water_level <= 30 && result[0][0].water_level > 25) {
//         response.footer = { riskCode: "21", riskMsg: "caution" };
//       } else if (result[0][0].water_level <= 50) {
//         response.footer = { riskCode: "22", riskMsg: "warning" };
//       } else if (result[0][0].water_level >= 70) {
//         response.footer = { riskCode: "21", riskMsg: "danger" };
//       } else {
//         response.footer = { riskCode: "20", riskMsg: "safety" };
//       }
//     }

//     res.json(response);
//   } catch (error) {
//     response.header = {
//       resultCode: "10",
//       resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
//     };
//     res.status(400).json(response);
//   }
// });

router.post("/year", async (req, res) => {
  logger.info("/sensor/year access");
  const { place_id, start_date } = req.body;
  const yyyymmddDateRegExp = /^([\d]{4})-([\d]{2})-([\d]{2})$/;

  let { end_date } = req.body;
  end_date = moment(end_date).add(1, "days").format("YYYY-MM-DD");

  let sql = `select cast(avg(precipitation) as signed integer) as precipitation, 
  cast(avg(water_level) as signed integer) as water_level, 
  cast(avg(temperature) as signed integer) as temperature, 
  cast(avg(humidity) as signed integer) as humidity, date_format(created_at, '%Y-%m-%d %T') as created_at 
  from sensor where 1 = 1`;
  let condition = [];
  let response = {
    header: {},
  };

  if (
    moment(start_date).format("YYYYMMDD") === "Invalid date" ||
    moment(end_date).format("YYYYMMDD") === "Invalid date" ||
    Number(moment(start_date).format("YYYYMMDD")) >
      Number(moment(end_date).format("YYYYMMDD"))
  ) {
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }

  try {
    if (place_id) {
      sql += " and place_id = ?";
      condition.push(place_id);
    }

    if (
      yyyymmddDateRegExp.test(start_date) &&
      yyyymmddDateRegExp.test(end_date)
    ) {
      if (start_date && end_date) {
        sql +=
          " and created_at >= ? and created_at < ? group by year(created_at)";
        condition.push(start_date);
        condition.push(end_date);
      }
    }
    const result = await pool.query(sql, condition);

    response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    response.body = result[0];

    res.json(response);
  } catch (error) {
    logger.error("/sensor/yearerror message:", error);
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
});

router.post("/month", async (req, res) => {
  logger.info("/sensor/month access");
  const { place_id, start_date } = req.body;
  const yyyymmddDateRegExp = /^([\d]{4})-([\d]{2})-([\d]{2})$/;

  let { end_date } = req.body;
  end_date = moment(end_date).add(1, "days").format("YYYY-MM-DD");

  let sql = `select 
  concat(month(s.created_at), '월') as month,
  cast(avg(precipitation) as signed integer) as precipitation, 
  cast(avg(water_level) as signed integer) as water_level, 
  cast(avg(temperature) as signed integer) as temperature, 
  cast(avg(humidity) as signed integer) as humidity, 
  date_format(s.created_at, '%Y-%m-%d %T') as created_at, r.water_level_caution, r.water_level_warning, r.water_level_danger
  from sensor s
  join risk_detection r
  on s.place_id = r.id
  where 1 = 1`;
  let condition = [];
  let response = {
    header: {},
  };

  if (
    moment(start_date).format("YYYYMMDD") === "Invalid date" ||
    moment(end_date).format("YYYYMMDD") === "Invalid date" ||
    Number(moment(start_date).format("YYYYMMDD")) >
      Number(moment(end_date).format("YYYYMMDD"))
  ) {
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }

  try {
    if (place_id) {
      sql += " and s.place_id = ?";
      condition.push(place_id);
    }

    if (
      yyyymmddDateRegExp.test(start_date) &&
      yyyymmddDateRegExp.test(end_date)
    ) {
      if (start_date && end_date) {
        sql +=
          " and s.created_at >= ? and s.created_at < ? group by month(s.created_at)";
        condition.push(start_date);
        condition.push(end_date);
      }
    }
    const result = await pool.query(sql, condition);

    response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    response.body = result[0];

    res.json(response);
  } catch (error) {
    logger.error("/sensor/year error message:", error);
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
});

router.post("/hour", async (req, res) => {
  logger.info("/sensor/hour access");
  const { place_id, start_date } = req.body;
  const yyyymmddDateRegExp = /^([\d]{4})-([\d]{2})-([\d]{2})$/;

  let { end_date } = req.body;
  end_date = moment(end_date).add(1, "days").format("YYYY-MM-DD");
  let sql = `
  select 
  cast(avg(precipitation) as signed integer) as precipitation, 
  cast(avg(water_level) as signed integer) as water_level, 
  cast(avg(temperature) as signed integer) as temperature, 
  cast(avg(humidity) as signed integer) as humidity, 
  date_format(s.created_at, '%Y-%m-%d %T') as created_at, r.water_level_caution, r.water_level_warning, r.water_level_danger
  from sensor s
  join risk_detection r
  on s.place_id = r.id
  where 1 = 1`;
  let condition = [];
  let response = {
    header: {},
  };
  if (
    moment(start_date).format("YYYYMMDD") === "Invalid date" ||
    moment(end_date).format("YYYYMMDD") === "Invalid date" ||
    Number(moment(start_date).format("YYYYMMDD")) >
      Number(moment(end_date).format("YYYYMMDD"))
  ) {
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
  try {
    if (place_id) {
      sql += " and s.place_id = ?";
      condition.push(place_id);
    }

    if (
      yyyymmddDateRegExp.test(start_date) &&
      yyyymmddDateRegExp.test(end_date)
    ) {
      if (start_date && end_date) {
        sql +=
          " and s.created_at >= ? and s.created_at < ? group by day(s.created_at), hour(s.created_at) order by s.created_at";
        condition.push(start_date);
        condition.push(end_date);
      }
    }
    const result = await pool.query(sql, condition);
    response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    response.body = result[0];

    res.json(response);
  } catch (error) {
    logger.error("/sensor/hour error message:", error);
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };

    res.status(400).json(response);
  }
});

router.post("/insert", async (req, res) => {
  logger.info("/sensor/insert access");
  const { precipitation, water_level, temperature } = req.body;
  let response = {
    header: {},
  };

  if (
    moment(start_date).format("YYYYMMDD") === "Invalid date" ||
    moment(end_date).format("YYYYMMDD") === "Invalid date" ||
    Number(moment(start_date).format("YYYYMMDD")) >
      Number(moment(end_date).format("YYYYMMDD"))
  ) {
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
  try {
    const result = await pool.query(
      "insert into sensor (place_id, precipitation, water_level, temperature, humidity) values (1, ?, ?, ?, 12)", //여러 PLC 에서 값이 들어오면 수정해야함
      [precipitation, water_level, temperature]
    );
    if (result[0].affectedRows > 0) {
      response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
      res.json(response);
    } else {
      response.header = {
        resultCode: "10",
        resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
      };
      res.status(400).json(response);
    }
  } catch (error) {
    logger.error("/sensor/insert error message:", error);
    console.log(error);
    response.header = { resultCode: "02", resultMsg: "NODATA_ERROR" };
    res.status(400).json(response);
  }
});

router.post("/risk", async (req, res) => {
  logger.info("/sensor/risk access");
  const data = req.body;
  let response = {
    header: {},
  };

  let cnt = 0;
  try {
    for (let i = 0; i < data.length; i++) {
      const result = await pool.query(
        "update risk_detection set water_level_danger = ? where id = ?",
        [Number(data[i].water_level_danger), data[i].place_id]
      );
      if (result[0].affectedRows > 0) {
        cnt = cnt + 1;
      }
    }

    if (cnt >= data.length) {
      response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    } else {
      response.header = {
        resultCode: "10",
        resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
      };
    }
    res.json(response);
  } catch (error) {
    logger.error("/sensor/risk error message:", error);
    console.log(error);
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
});

router.post("/readrisk", async (req, res) => {
  let response = {
    header: {},
  };
  try {
    const result = await pool.query("select * from risk_detection");
    response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    response.body = result[0];

    res.json(response);
  } catch (error) {
    logger.error("/sensor/readrisk error message:", error);
    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
});

router.post("/test", async (req, res) => {
  try {
    const result = await pool.query("select * from sensor");
    res.json(result[0]);
  } catch (error) {}
});

module.exports = router;
