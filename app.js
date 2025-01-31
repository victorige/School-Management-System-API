const config = require("./config/index.config.js");
const Cortex = require("ion-cortex");
const ManagersLoader = require("./loaders/ManagersLoader.js");

const mongoDB = config.dotEnv.MONGO_URI
  ? require("./connect/mongo.js")({
      uri: config.dotEnv.MONGO_URI,
    })
  : null;

const cortex = new Cortex({
  prefix: config.dotEnv.CORTEX_PREFIX,
  url: config.dotEnv.CORTEX_REDIS,
  type: config.dotEnv.CORTEX_TYPE,
  state: () => {
    return {};
  },
  activeDelay: "50ms",
  idlDelay: "200ms",
});

const managersLoader = new ManagersLoader({ config, cortex });
const managers = managersLoader.load();

const httpServer = managers.httpServer;

module.exports = httpServer;
