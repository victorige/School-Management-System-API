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
    this.usersCollection = "users";
    this.httpExposed = ["post=create", "get=getAll"];
  }

  // Create a new user
  async create({ __auth, __isSuperAdmin, __body }) {
    try {
      const { user } = __auth;
      const { firstName, lastName, email, password, role, schoolId } = __body;

      this.utils.logger(
        "INFO",
        `Attempting to create user with email: ${email}`
      );

      // Check if user already exists (unique email check)
      const existingUser = await this.mongomodels.user.findOne({ email });
      if (existingUser)
        return this.utils.throwError("Email already in use.", 400);

      // If the role is school_admin, ensure that schoolId is provided and valid
      if (role === "school_admin") {
        if (!schoolId)
          return this.utils.throwError(
            "schoolId is required for school_admin role.",
            400
          );

        const schoolExists = await this.mongomodels.school.exists({
          _id: schoolId,
        });
        if (!schoolExists)
          return this.utils.throwError(
            "The specified school does not exist.",
            404
          );
      }

      // Create user object and save to the database
      const createdUser = new this.mongomodels.user({
        firstName,
        lastName,
        email,
        password,
        role,
        schoolId,
        createdBy: user._id,
        updatedBy: user._id,
      });

      // Save user to DB
      await createdUser.save();

      // Remove password from the response for security
      const userResponse = { ...createdUser.toObject() };
      delete userResponse.password;

      this.utils.logger("OK", `User created successfully with email: ${email}`);

      return this.utils.returnSuccess(
        "User created successfully.",
        { user: userResponse },
        201
      );
    } catch (error) {
      return this.utils.returnError("Failed to create user", error);
    }
  }

  async getAll({ __auth, __isSuperAdmin, __query }) {
    try {
      let {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "asc",
        filters = {},
      } = __query;

      // Parse and ensure valid pagination and sorting values
      page = Math.max(parseInt(page), 1); // Ensure page is at least 1
      limit = Math.max(parseInt(limit), 1); // Ensure limit is at least 1
      sortOrder = sortOrder === "desc" ? -1 : 1; // Ensure sortOrder is either 1 or -1

      // Log pagination and sorting details
      this.utils.logger(
        "INFO",
        `Fetching users with pagination: page ${page}, limit ${limit}, sortBy ${sortBy}, sortOrder ${sortOrder}`
      );

      // Build dynamic match conditions based on filters
      const matchConditions = this.utils.buildFilterConditions(filters);

      // Create aggregation pipeline for MongoDB
      const pipeline = this.utils.buildAggregationPipeline(
        matchConditions,
        page,
        limit,
        sortBy,
        sortOrder
      );

      // Query to fetch users with aggregation pipeline
      const result = await this.mongomodels.user.aggregate(pipeline);

      // Extract paginated users and total count from the result
      const users = result[0]?.data || [];
      const pagination = this.utils.buildPagination({ result, page, limit });

      return this.utils.returnSuccess("Users fetched successfully.", {
        users,
        pagination,
        appliedFilters: filters,
      });
    } catch (error) {
      return this.utils.returnError("Failed to retrieve users", error, 500);
    }
  }
};
