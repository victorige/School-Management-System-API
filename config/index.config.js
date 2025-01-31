require("dotenv").config();
const os = require("os");
const pjson = require("../package.json");
const utils = require("../libs/utils");
const SERVICE_NAME = process.env.SERVICE_NAME
  ? utils.slugify(process.env.SERVICE_NAME)
  : pjson.name;
const SERVER_PORT = process.env.SERVER_PORT || 5111;
const ADMIN_PORT = process.env.ADMIN_PORT || 5222;
const ADMIN_URL = process.env.ADMIN_URL || `http://localhost:${ADMIN_PORT}`;
const ENV = process.env.ENV || "development";
const REDIS_URI = process.env.REDIS_URI || "redis://127.0.0.1:6379";
const SERVER_API = process.env.SERVER_API;

const CORTEX_REDIS = process.env.CORTEX_REDIS || REDIS_URI;
const CORTEX_PREFIX = process.env.CORTEX_PREFIX || "none";
const CORTEX_TYPE = process.env.CORTEX_TYPE || SERVICE_NAME;
const OYSTER_REDIS = process.env.OYSTER_REDIS || REDIS_URI;
const OYSTER_PREFIX = process.env.OYSTER_PREFIX || "none";

const CACHE_REDIS = process.env.CACHE_REDIS || REDIS_URI;
const CACHE_PREFIX = process.env.CACHE_PREFIX || `${SERVICE_NAME}:ch`;

const MONGO_URI =
  process.env.MONGO_URI || `mongodb://localhost:27017/${SERVICE_NAME}`;
const config = require(`./envs/${ENV}.js`);

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || null;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || null;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || null;

if (!AUTH_TOKEN_SECRET || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
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
  CACHE_REDIS,
  CACHE_PREFIX,
  MONGO_URI,
  SERVER_PORT,
  ADMIN_PORT,
  ADMIN_URL,
  SERVER_API,
  AUTH_TOKEN_SECRET,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
};

module.exports = config;
