require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3002;
const PHPSESSID = process.env.PHPSESSID;
const CHINA_TIMEZONE = 'Asia/Shanghai';

module.exports = {
  JWT_SECRET,
  MONGO_URI,
  PORT,
  PHPSESSID,
  APP_ELECTED_TIMEZONE: CHINA_TIMEZONE,
};
