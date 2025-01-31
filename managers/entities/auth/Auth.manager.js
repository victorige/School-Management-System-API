const { schoolId } = require("../../_common/schema.models");

module.exports = class User {
  constructor({
    utils,
    config,
    cortex,
    managers,
    validators,
    mongomodels,
  } = {}) {
    this.utils = utils;
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "user";
    this.httpExposed = ["post=login"];
  }

  /** Login user */
  async login({ __body }) {
    try {
      const { email, password } = __body;

      this.utils.logger(
        "INFO",
        `Attempting login for user with email: ${email}`
      );

      // Find user and include password explicitly
      const user = await this.mongomodels.user
        .findOne({ email })
        .select("+password");

      if (!user) {
        return this.utils.throwError(
          "Invalid email or password",
          { email },
          401
        );
      }

      // Validate password
      if (!(await user.validatePassword(password))) {
        return this.utils.returnError(
          "Invalid email or password",
          { email },
          401
        );
      }

      // Remove password before returning user data
      const userResponse = user.toObject();
      delete userResponse.password;

      // Generate authentication token
      const token = this.tokenManager.genAuthToken({ user: userResponse });

      this.utils.logger(
        "OK",
        `User with email: ${email} logged in successfully`
      );

      return this.utils.returnSuccess("Login successful", {
        user: userResponse,
        token,
      });
    } catch (error) {
      return this.utils.returnError("Failed to log in", error);
    }
  }
};
