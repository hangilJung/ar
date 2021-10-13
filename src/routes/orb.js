const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const logger = require("../config/logger");

router.post("/", async (req, res) => {
  logger.info("/orb access");
  try {
    const result = await pool.query(
      `SELECT
    P.id as seqNo, 
    PLACE_TYPE as placeType, 
    PLACE_NAME as placeName,
    concat(precipitation, 'mm') as rainFall ,
    concat(water_level, 'M') as waterLevel,
    concat(temperature, '℃') as temperature,
    concat(humidity, '%') as humidity,
    IMAGE1 as imageUrl1,
    IMAGE2 as imageUrl2,
    IMAGE3 as imageUrl3,
    IMAGE4 as imageUrl4,
    IMAGE5 as imageUrl5,
    s.created_at as obsrvtnDt,
    address1,
    address2,
    address3,
    cast(latitude as char) as latitude,
    cast(longitude as char) as longitude,
    if( short_term_forecast.pty = 0, 
    case
		when short_term_forecast.sky = 1 then
			'맑음'
		when short_term_forecast.sky = 3 then
			'구름많음'
		when short_term_forecast.sky = 4 then
			'흐림'
    end    
    , 
    CASE
		WHEN short_term_forecast.pty = 1 THEN
			'비'
		WHEN short_term_forecast.pty = 2 THEN
			'비/눈'
		WHEN short_term_forecast.pty = 3 THEN
			'눈'
		WHEN short_term_forecast.pty = 5 THEN
			'빗방울'
		WHEN short_term_forecast.pty = 6 THEN
			'빗방울눈날림'
		WHEN short_term_forecast.pty = 7 THEN
			'눈날림'
	END  		
	) as weatherName,    		
    CASE 
      WHEN WATER_LEVEL > WATER_LEVEL_DANGER THEN 
         '위험'
      WHEN WATER_LEVEL > WATER_LEVEL_WARNING THEN
         '경고'
      WHEN WATER_LEVEL > WATER_LEVEL_CAUTION THEN
         '주의'
      ELSE
         '정상'
   END AS riskStepName
  FROM PLACE P LEFT OUTER JOIN (SELECT 
                              PLACE_ID,
                              WATER_LEVEL,
                              TEMPERATURE,       
                              HUMIDITY,
                              PRECIPITATION,
                              created_at
                             FROM SENSOR, (SELECT MAX(ID) AS ID FROM SENSOR GROUP BY PLACE_ID) X
                            WHERE 1 = 1 
                              AND SENSOR.ID = X.ID) S
      ON S.PLACE_ID = P.SENSOR_ID LEFT OUTER JOIN RISK_DETECTION R 
      ON P.sensor_id = R.ID, 
      (select * from short_term_forecast where created_at = (select max(created_at) from short_term_forecast)) as short_term_forecast    
      `
    );

    response = {
      resCode: "00",
      resMsg: "NORMAL_SERVICE",
      description: "test",
    };
    response.dataList = result[0];
    res.json(response);
  } catch (error) {
    logger.error("/orb error message:", error);
    response = {
      resCode: "00",
      resMsg: "NORMAL_SERVICE",
      description: "test",
    };
  }
});

router.post("/test", async (req, res) => {});

module.exports = router;
