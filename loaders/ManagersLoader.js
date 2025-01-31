const MiddlewaresLoader = require("./MiddlewaresLoader");
const ApiHandler = require("../managers/api/Api.manager");
const HttpServer = require("../managers/http/HttpServer.manager");
const ResponseDispatcher = require("../managers/response_dispatcher/ResponseDispatcher.manager");
const VirtualStack = require("../managers/virtual_stack/VirtualStack.manager");

const ValidatorsLoader = require("./ValidatorsLoader");
const ResourceMeshLoader = require("./ResourceMeshLoader");
const MongoLoader = require("./MongoLoader");

const utils = require("../libs/utils");

const systemArch = require("../static_arch/main.system");
const TokenManager = require("../managers/token/Token.manager");

const UserManager = require("../managers/entities/user/User.manager");
const AuthManager = require("../managers/entities/auth/Auth.manager");
const SchoolManager = require("../managers/entities/school/School.manager");
const ClassroomManager = require("../managers/entities/classroom/Classroom.manager");
const StudentManager = require("../managers/entities/student/Student.manager");
const SeedManager = require("../managers/entities/seed/Seed.manager");

/**
 * load sharable modules
 * @return modules tree with instance of each module
 */
module.exports = class ManagersLoader {
  constructor({ config, cortex }) {
    this.managers = {};
    this.config = config;
    this.cortex = cortex;

    this._preload();
    this.injectable = {
      utils,
      config,
      cortex,
      managers: this.managers,
      validators: this.validators,
      mongomodels: this.mongomodels,
      resourceNodes: this.resourceNodes,
      mws: this.mws,
    };
  }

  _preload() {
    const validatorsLoader = new ValidatorsLoader({
      models: require("../managers/_common/schema.models"),
      customValidators: require("../managers/_common/schema.validators"),
    });
    const resourceMeshLoader = new ResourceMeshLoader({});
    const mongoLoader = new MongoLoader({ schemaExtension: "mongoModel.js" });

    this.validators = validatorsLoader.load();
    this.resourceNodes = resourceMeshLoader.load();
    this.mongomodels = mongoLoader.load();
  }

  load() {
    this.managers.responseDispatcher = new ResponseDispatcher();
    const middlewaresLoader = new MiddlewaresLoader(this.injectable);
    const mwsRepo = middlewaresLoader.load();
    const { layers, actions } = systemArch;
    this.injectable.mwsRepo = mwsRepo;
    /*****************************************CUSTOM MANAGERS*****************************************/
    this.managers.token = new TokenManager(this.injectable);
    this.managers.user = new UserManager(this.injectable);
    this.managers.auth = new AuthManager(this.injectable);
    this.managers.school = new SchoolManager(this.injectable);
    this.managers.classroom = new ClassroomManager(this.injectable);
    this.managers.student = new StudentManager(this.injectable);
    this.managers.seed = new SeedManager(this.injectable);
    /*************************************************************************************************/
    this.managers.mwsExec = new VirtualStack({
      ...{ preStack: [/* '__token', */ "__device"] },
      ...this.injectable,
    });
    this.managers.userApi = new ApiHandler({
      ...this.injectable,
      ...{ prop: "httpExposed" },
    });
    this.managers.httpServer = new HttpServer({
      config: this.config,
      managers: this.managers,
    });
    return this.managers;
  }
};
