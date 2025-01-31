module.exports = class Seed {
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
    this.usersCollection = "users";
    this.httpExposed = ["get=admin"];
  }

  // Helper function to check if the admin user already exists
  async checkAdminExists() {
    const { SUPER_ADMIN_EMAIL } = this.config.dotEnv;
    if (!SUPER_ADMIN_EMAIL) {
      throw new Error("SUPER_ADMIN_EMAIL is not defined in the config");
    }
    return await this.mongomodels.user
      .findOne({ email: SUPER_ADMIN_EMAIL })
      .select("-password");
  }

  // Seed admin user
  async admin() {
    const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = this.config.dotEnv;

    try {
      this.utils.logger("INFO", "Attempting to seed admin user...");

      // Validate config values
      if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
        return this.utils.logger(
          "ERROR",
          "Missing SUPER_ADMIN credentials in the configuration."
        );
      }

      // Check if admin already exists in the database
      const existingAdmin = await this.checkAdminExists();
      if (existingAdmin) {
        this.utils.logger(
          "OK",
          `Admin user already seeded with email: ${SUPER_ADMIN_EMAIL}`
        );
        return this.utils.returnSuccess(
          "Admin user created successfully.",
          { user: existingAdmin },
          201
        );
      }

      // Create a new super admin user
      const createdUser = new this.mongomodels.user({
        firstName: "Admin",
        lastName: "Super",
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD, // Make sure the password is hashed in the schema pre-save hook
        role: "super_admin",
      });

      // Save user to the database
      await createdUser.save();

      // Remove sensitive data (password) from the response for security
      const userResponse = { ...createdUser.toObject() };
      delete userResponse.password;

      // Log success
      this.utils.logger(
        "OK",
        `Admin user created successfully with email: ${SUPER_ADMIN_EMAIL}`
      );

      // Return success message
      return this.utils.returnSuccess(
        "Admin user created successfully.",
        { user: userResponse },
        201
      );
    } catch (error) {
      this.utils.logger(
        "ERROR",
        `Failed to create admin user: ${error.message}`
      );
      return this.utils.returnError("Failed to create admin user", error);
    }
  }
};
