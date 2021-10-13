const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const logger = require("../config/logger");

router.post("/", async (req, res) => {
  logger.info("/short_term_live access");
  const { pty, reh, rn1, t1h, uuu, vec, vvv, wsd } = req.body;

  let response = {
    header: {},
  };
  try {
    const result = await pool.query(
      "insert into short_term_live (pty, reh, rn1, t1h, uuu, vec, vvv, wsd) values (?, ?, ?, ?, ?, ?, ?, ?) ",
      [pty, reh, rn1, t1h, uuu, vec, vvv, wsd]
    );

    if (result[0].affectedRows > 0) {
      response.header.resultCode = "00";
      response.header.resultMsg = "NORMAL_SERVICE";
      res.json(response);
    } else {
      response.header.resultCode = "10";
      response.header.resultMsg = "INVALID_REQUEST_PARAMETER_ERROR";
      res.status(400).json(response);
    }
  } catch (error) {
    logger.error("/short_term_live error message:", error);
  }
});

router.post("/read", async (req, res) => {
  logger.info("/short_term_live read access");
  let response = {
    header: {},
  };
  try {
    const result = await pool.query(
      "select * from short_term_live where id = (select max(id) as id from short_term_live);"
    );

    response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    response.body = result[0];

    res.json(response);
  } catch (error) {
    logger.error("/short_term_live/read error message:", error);

    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };

    res.status(400).json(response);
  }
});

router.post("/daily/temp", async (req, res) => {
  logger.info("/daily/temp access");
  const { tmn, tmx } = req.body;

  let response = {
    header: {},
  };
  try {
    const result = await pool.query(
      "insert into daily_max_min_temp (tmn, tmx) values (?, ?)",
      [tmn, tmx]
    );

    if (result[0].affectedRows > 0) {
      response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
      res.json(response);
    } else {
      logger.error("/daily/temp error message: INVAID_REQUEST_PARAMETER_ERROR");
      response.header.resultCode = "10";
      response.header.resultMsg = "INVALID_REQUEST_PARAMETER_ERROR";
      res.status(400).json(response);
    }
  } catch (error) {
    logger.error("/daily/temp error message:", error);

    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };

    res.status(400).json(response);
  }
});

router.post("/short", async (req, res) => {
  logger.info("/short access");
  const { tmp, uuu, vvv, vec, wsd, sky, pty, pop, pcp, reh, sno } = req.body;
  let response = {
    header: {},
  };

  try {
    const result = await pool.query(
      "insert into short_term_forecast (tmp, uuu, vvv, vec, wsd, sky, pty, pop, pcp, reh, sno) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [tmp, uuu, vvv, vec, wsd, sky, pty, pop, pcp, reh, sno]
    );
    if (result[0].affectedRows > 0) {
      response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
      res.json(response);
    } else {
      logger.error(
        "/weather/short error message: INVAID_REQUEST_PARAMETER_ERROR"
      );
      response.header.resultCode = "10";
      response.header.resultMsg = "INVALID_REQUEST_PARAMETER_ERROR";
      res.status(400).json(response);
    }
  } catch (error) {
    logger.error("/weather/sky error message:", error);

    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
});

router.post("/short/read", async (req, res) => {
  logger.info("/short/read access");
  try {
    const result = await pool.query(
      "select * from short_term_forecast where short_term_forecast_id = (select max(short_term_forecast_id) from short_term_forecast)"
    );

    console.log(result[0]);
    res.json(result[0]);
  } catch (error) {
    logger.error("/short/read error message: ", error);
  }
});

router.post("/header", async (req, res) => {
  logger.info("/header access");

  let response = {
    header: {},
  };

  try {
    const result = await pool.query(`
    select 
    if( s.pty = 0, 
    case
		when s.sky = 1 then
			'맑음'
		when s.sky = 3 then
			'구름많음'
		when s.sky = 4 then
			'흐림'
    end    
    , 
    CASE
		WHEN s.pty = 1 THEN
			'비'
		WHEN s.pty = 2 THEN
			'비/눈'
		WHEN s.pty = 3 THEN
			'눈'
		WHEN s.pty = 5 THEN
			'빗방울'
		WHEN s.pty = 6 THEN
			'빗방울눈날림'
		WHEN s.pty = 7 THEN
			'눈날림'
	END  		
	) as weatherName,
  s.tmp,
  s.pop,
  d.tmn,
  d.tmx,
  s.created_at    
    from (
		      select * 
		      from short_term_forecast 
          where created_at = (
							                select max(created_at) 
							                from short_term_forecast)
                              ) as s, 
	      (
		      select *
          from daily_max_min_temp
          where created_at = (
							                select max(created_at) 
                              from daily_max_min_temp)
                              ) as d;`);

    response.header = { resultCode: "00", resultMsg: "NORMAL_SERVICE" };
    response.body = result[0];

    res.json(response);
  } catch (error) {
    logger.error("/header error message:", error);

    response.header = {
      resultCode: "10",
      resultMsg: "INVALID_REQUEST_PARAMETER_ERROR",
    };
    res.status(400).json(response);
  }
});

module.exports = router;
