module.exports = class School {
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
    this.httpExposed = [
      "get=getAll",
      "post=create",
      "get=get",
      "put=update",
      "delete=delete",
    ];
  }

  /** Get all schools with pagination */
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
        `Fetching schools with pagination: page ${page}, limit ${limit}, sortBy ${sortBy}, sortOrder ${sortOrder}`
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

      const result = await this.mongomodels.school.aggregate(pipeline);

      // Extract paginated schools and total count from the result
      const schools = result[0]?.data || [];
      const pagination = this.utils.buildPagination({ result, page, limit });

      // Return success response with filters and new pagination format
      return this.utils.returnSuccess("Schools retrieved successfully.", {
        schools,
        pagination,
        appliedFilters: filters, // Return the filters that were applied
      });
    } catch (error) {
      return this.utils.returnError("Failed to retrieve schools", error);
    }
  }

  /** Create a new school */
  async create({ __auth, __isSuperAdmin, __body }) {
    try {
      const { user } = __auth;
      const { name, address, contactEmail, phone } = __body;

      this.utils.logger(
        "INFO",
        `Attempting to create school with name: ${name}`
      );

      const existingSchool = await this.mongomodels.school.exists({ name });
      if (existingSchool)
        return this.utils.throwError(
          "School with this name already exists.",
          400
        );

      const school = await this.mongomodels.school.create({
        name,
        address,
        contactEmail,
        phone,
        createdBy: user._id,
        updatedBy: user._id,
      });

      return this.utils.returnSuccess(
        "School created successfully.",
        { school },
        201
      );
    } catch (error) {
      return this.utils.returnError("Failed to create school", error);
    }
  }

  /** Get school by ID */
  async get({ __auth, __isSuperAdmin, __params }) {
    try {
      const { id } = __params;

      this.utils.logger("INFO", `Attempting to fetch school with ID: ${id}`);

      const school = await this.mongomodels.school.findById(id).lean();

      if (!school) return this.utils.throwError("School not found.", 404);

      return this.utils.returnSuccess("School retrieved successfully.", {
        school,
      });
    } catch (error) {
      return this.utils.returnError(`Failed to retrieve school`, error);
    }
  }

  /** Update school by ID */
  async update({ __auth, __isSuperAdmin, __body, __params }) {
    try {
      const { user } = __auth;
      const { id } = __params;
      const { name } = __body;

      this.utils.logger("INFO", `Attempting to update school with ID: ${id}`);

      const existingSchool = await this.mongomodels.school.findOne({ name });
      if (existingSchool && existingSchool._id.toString() !== id)
        return this.utils.throwError(
          "School with this name already exists.",
          400
        );

      const updatedSchool = await this.mongomodels.school.findByIdAndUpdate(
        id,
        { ...__body, updatedBy: user._id },
        { new: true, runValidators: true, lean: true }
      );

      if (!updatedSchool)
        return this.utils.throwError("School not found.", 404);

      return this.utils.returnSuccess("School updated successfully.", {
        school: updatedSchool,
      });
    } catch (error) {
      return this.utils.returnError("Failed to update school", error);
    }
  }

  /** Delete school by ID */
  async delete({ __auth, __isSuperAdmin, __params }) {
    try {
      const { id } = __params;

      this.utils.logger("INFO", `Attempting to delete school with ID: ${id}`);

      const deletedSchool = await this.mongomodels.school.findByIdAndDelete(id);

      if (!deletedSchool)
        return this.utils.throwError("School not found.", 404);

      return this.utils.returnSuccess("School deleted successfully.", null);
    } catch (error) {
      return this.utils.returnError("Failed to delete school", error);
    }
  }
};
