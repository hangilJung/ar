const express = require("express");
const router = express.Router();
const pool = require("../../config/config");
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { user_id, user_pw } = req.body;

        const result = await pool.query('select * from manager where user_id = ? and user_pw = ?', [user_id, user_pw]);  
        
        const token = jwt.sign({
            nickname: result[0][0].nickname
            }, process.env.JWT_SECRET,{
            expiresIn: '5m',
            issuer: 'hg'
        });

        res.json({msg: "로그인 성공", token})

    } catch (error) {
        console.log(error);
        res.json({msg: "로그인 실패"});
    }
});


module.exports = router;