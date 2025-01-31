require("dotenv").config();

const pjson = require("../package.json");
const utils = require("../libs/utils");

const ENV = process.env.ENV || "development";
const config = require(`./envs/${ENV}.js`);

const SERVICE_NAME = process.env.SERVICE_NAME
  ? utils.slugify(process.env.SERVICE_NAME)
  : pjson.name;

const SERVER_PORT = process.env.SERVER_PORT || 5111;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${ADMIN_PORT}`;
const SERVER_API = `${process.env.SERVER_URL}/api`;

const REDIS_URI = process.env.REDIS_URI || "redis://127.0.0.1:6379";
const CORTEX_REDIS = process.env.CORTEX_REDIS || REDIS_URI;
const CORTEX_PREFIX = process.env.CORTEX_PREFIX || "none";
const CORTEX_TYPE = process.env.CORTEX_TYPE || SERVICE_NAME;
const OYSTER_REDIS = process.env.OYSTER_REDIS || REDIS_URI;
const OYSTER_PREFIX = process.env.OYSTER_PREFIX || "none";

const MONGO_URI =
  process.env.MONGO_URI || `mongodb://localhost:27017/${SERVICE_NAME}`;

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || null;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || null;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || null;

if (
  !REDIS_URI ||
  !AUTH_TOKEN_SECRET ||
  !SUPER_ADMIN_EMAIL ||
  !SUPER_ADMIN_PASSWORD ||
  !SERVER_URL
) {
  throw Error("missing .env variables check index.config");
}

config.dotEnv = {
  SERVICE_NAME,
  ENV,
  CORTEX_REDIS,
  CORTEX_PREFIX,
  CORTEX_TYPE,
  OYSTER_REDIS,
  OYSTER_PREFIX,
  MONGO_URI,
  SERVER_PORT,
  SERVER_API,
  AUTH_TOKEN_SECRET,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
  SERVER_URL,
};

module.exports = config;
