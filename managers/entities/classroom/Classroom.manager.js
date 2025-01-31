const mongoose = require("mongoose");

module.exports = class Classroom {
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

  /** Get all classrooms with pagination */
  async getAll({ __auth, __isSchoolAdmin, __query }) {
    try {
      const { user } = __auth;
      let {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "asc",
        filters = {},
      } = __query;

      filters.schoolId = new mongoose.Types.ObjectId(user.schoolId);

      // Parse and ensure valid pagination and sorting values
      page = Math.max(parseInt(page), 1); // Ensure page is at least 1
      limit = Math.max(parseInt(limit), 1); // Ensure limit is at least 1
      sortOrder = sortOrder === "desc" ? -1 : 1; // Ensure sortOrder is either 1 or -1

      // Log pagination and sorting details
      this.utils.logger(
        "INFO",
        `Fetching classrooms with pagination: page ${page}, limit ${limit}, sortBy ${sortBy}, sortOrder ${sortOrder}`
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

      const result = await this.mongomodels.classroom.aggregate(pipeline);

      // Extract paginated classrooms and total count from the result
      const classrooms = result[0]?.data || [];
      const pagination = this.utils.buildPagination({ result, page, limit });

      // Return success response with filters and new pagination format
      return this.utils.returnSuccess("Classrooms retrieved successfully.", {
        classrooms,
        pagination,
        appliedFilters: filters, // Return the filters that were applied
      });
    } catch (error) {
      return this.utils.returnError("Failed to retrieve classrooms", error);
    }
  }

  /** Create a new classroom */
  async create({ __auth, __isSchoolAdmin, __body }) {
    try {
      const { user } = __auth;
      const { name, capacity, resources } = __body;

      this.utils.logger(
        "INFO",
        `Attempting to create classroom: ${name} for schoolId: ${user.schoolId}`
      );

      const school = await this.mongomodels.school.findById(user.schoolId);
      if (!school) return this.utils.throwError("School not found.", 404);

      const existingClassroom = await this.mongomodels.classroom.findOne({
        name,
        schoolId: user.schoolId,
      });
      if (existingClassroom)
        return this.utils.throwError(
          "Classroom with this name already exists in the specified school.",
          400
        );

      const classroom = await this.mongomodels.classroom.create({
        schoolId: user.schoolId,
        name,
        capacity,
        resources,
        createdBy: user._id,
        updatedBy: user._id,
      });

      return this.utils.returnSuccess(
        "Classroom created successfully.",
        { classroom },
        201
      );
    } catch (error) {
      return this.utils.returnError("Failed to create classroom", error);
    }
  }

  /** Get classroom by ID */
  async get({ __auth, __isSchoolAdmin, __params }) {
    try {
      const { user } = __auth;
      const { id } = __params;

      this.utils.logger(
        "INFO",
        `Attempting to fetch classroom with ID: ${id} for schoolId: ${user.schoolId}`
      );

      // Fetch the classroom using the ID and ensure it belongs to the user's school
      const classroom = await this._getClassroomForUser(id, user);

      return this.utils.returnSuccess("Classroom retrieved successfully.", {
        classroom,
      });
    } catch (error) {
      return this.utils.returnError("Failed to retrieve classroom", error);
    }
  }

  /** Update classroom by ID */
  async update({ __auth, __isSchoolAdmin, __body, __params }) {
    try {
      const { user } = __auth;
      const { id } = __params;
      const { name, capacity, resources } = __body;

      this.utils.logger(
        "INFO",
        `Attempting to update classroom with ID: ${id} for schoolId: ${user.schoolId}`
      );

      // Check if the classroom belongs to the user's school
      const classroom = await this._getClassroomForUser(id, user);

      // Check if another classroom with the same name exists (excluding the current one)
      const existingClassroom = await this.mongomodels.classroom.findOne({
        name,
        schoolId: user.schoolId, // Ensure the classroom belongs to the same school
      });

      if (existingClassroom && existingClassroom._id.toString() !== id)
        return this.utils.throwError(
          "Classroom with this name already exists.",
          400
        );

      // Update the classroom
      const updatedClassroom =
        await this.mongomodels.classroom.findByIdAndUpdate(
          id,
          { name, capacity, resources, updatedBy: user._id },
          { new: true, runValidators: true, lean: true }
        );

      if (!updatedClassroom)
        return this.utils.throwError("Failed to update classroom.", 404);

      return this.utils.returnSuccess("Classroom updated successfully.", {
        classroom: updatedClassroom,
      });
    } catch (error) {
      return this.utils.returnError("Failed to update classroom", error);
    }
  }

  /** Delete classroom by ID */
  async delete({ __auth, __isSchoolAdmin, __params }) {
    try {
      const { user } = __auth;
      const { id } = __params;

      this.utils.logger(
        "INFO",
        `Attempting to delete classroom with ID: ${id} for schoolId: ${user.schoolId}`
      );

      // Check if the classroom belongs to the user's school
      const classroom = await this._getClassroomForUser(id, user);

      // Delete the classroom
      const deletedClassroom =
        await this.mongomodels.classroom.findByIdAndDelete(id);

      if (!deletedClassroom)
        return this.utils.throwError("Failed to delete classroom.", 404);

      return this.utils.returnSuccess("Classroom deleted successfully.", {});
    } catch (error) {
      return this.utils.returnError("Failed to delete classroom", error); // Internal Server Error
    }
  }

  /** Helper function to check if classroom belongs to the user's school */
  async _getClassroomForUser(classroomId, user) {
    const classroom = await this.mongomodels.classroom
      .findOne({ _id: classroomId, schoolId: user.schoolId })
      .lean();
    if (!classroom)
      return this.utils.throwError(
        "Classroom not found or does not belong to your school.",
        404
      );
    return classroom;
  }
};
