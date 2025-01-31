const mongoose = require("mongoose");

module.exports = class Student {
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
      "patch=transfer",
      "delete=delete",
    ];
  }

  /** Get all students with pagination, filtered by classroomId if provided */
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
      if (filters?.classroomId)
        filters.classroomId = new mongoose.Types.ObjectId(filters.classroomId);

      // Parse and ensure valid pagination and sorting values
      page = Math.max(parseInt(page), 1); // Ensure page is at least 1
      limit = Math.max(parseInt(limit), 1); // Ensure limit is at least 1
      sortOrder = sortOrder === "desc" ? -1 : 1; // Ensure sortOrder is either 1 or -1

      // Log pagination and sorting details
      this.utils.logger(
        "INFO",
        `Fetching students with pagination: page ${page}, limit ${limit}, sortBy ${sortBy}, sortOrder ${sortOrder}`
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

      const result = await this.mongomodels.student.aggregate(pipeline);

      // Extract paginated data and total count from the result
      const students = result[0]?.data || [];
      const pagination = this.utils.buildPagination({ result, page, limit });

      // Return success response with filters and new pagination format
      return this.utils.returnSuccess("Students retrieved successfully.", {
        students,
        pagination,
        appliedFilters: filters, // Return the filters that were applied
      });
    } catch (error) {
      return this.utils.returnError("Failed to retrieve students", error);
    }
  }

  /** Create a new student */
  async create({ __auth, __isSchoolAdmin, __body }) {
    try {
      const { user } = __auth;
      const { classroomId, firstName, lastName, email, enrollmentDate } =
        __body;

      const [classroom, existingStudent] = await Promise.all([
        this.mongomodels.classroom
          .findOne({ _id: classroomId, schoolId: user.schoolId })
          .lean(),
        this.mongomodels.student
          .findOne({
            schoolId: user.schoolId,
            email,
          })
          .lean(),
      ]);

      if (!classroom)
        this.utils.throwError("Invalid classroom for this school.", 404);
      if (existingStudent?.email.toLowerCase() === email.toLowerCase())
        this.utils.throwError("Email already exists.", 400);

      const student = await this.mongomodels.student.create({
        schoolId: user.schoolId,
        classroomId,
        firstName,
        lastName,
        email,
        enrollmentDate,
        createdBy: user._id,
        updatedBy: user._id,
      });

      return this.utils.returnSuccess(
        "Student created successfully",
        {
          student,
        },
        201
      );
    } catch (error) {
      return this.utils.returnError("Failed to create student", error);
    }
  }

  /** Get student by ID */
  async get({ __auth, __isSchoolAdmin, __params }) {
    try {
      const { user } = __auth;
      const { id } = __params;

      this.utils.logger(
        "INFO",
        `Fetching student with ID: ${id} for schoolId: ${user.schoolId}`
      );

      // Retrieve student while ensuring it belongs to the user's school
      const student = await this.mongomodels.student
        .findOne({ _id: id, schoolId: user.schoolId })
        .select("-__v")
        .lean();

      if (!student)
        this.utils.throwError(
          "Student not found or does not belong to your school.",
          404
        );

      return this.utils.returnSuccess("Student retrieved successfully", {
        student,
      });
    } catch (error) {
      return this.utils.returnError("Failed to retrieve student", error);
    }
  }

  /** Update student by ID */
  async update({ __auth, __isSchoolAdmin, __body, __params }) {
    try {
      const { user } = __auth;
      const { id } = __params;
      const { firstName, lastName, email } = __body;

      this.utils.logger(
        "INFO",
        `Attempting to update student with ID: ${id} for schoolId: ${user.schoolId}`
      );

      // Retrieve the student by ID and ensure they belong to the user's school
      const student = await this.mongomodels.student
        .findOne({ _id: id, schoolId: user.schoolId })
        .lean();

      if (!student)
        this.utils.throwError(
          "Student not found or does not belong to your school.",
          404
        );

      // Update the student
      const updatedStudent = await this.mongomodels.student.findByIdAndUpdate(
        id,
        { firstName, lastName, email, updatedBy: user._id },
        { new: true, runValidators: true, lean: true }
      );

      if (!updatedStudent)
        this.utils.throwError("Failed to update student.", 400);

      return this.utils.returnSuccess("Student updated successfully", {
        student: updatedStudent,
      });
    } catch (error) {
      return this.utils.returnError("Failed to update student", error);
    }
  }

  /** Transfer student to another classroom */
  async transfer({ __auth, __isSchoolAdmin, __body }) {
    try {
      const { user } = __auth;
      const { studentId, classroomId } = __body;

      this.utils.logger(
        "INFO",
        `Attempting to transfer student with ID: ${studentId} to classroom with ID: ${classroomId} for schoolId: ${user.schoolId}`
      );

      // Find the student by ID and ensure they belong to the user's school
      const student = await this.mongomodels.student
        .findOne({ _id: studentId, schoolId: user.schoolId })
        .lean();
      if (!student)
        this.utils.throwError(
          "Student not found or does not belong to your school.",
          404
        );

      // Check if the target classroom exists and belongs to the same school
      const classroom = await this.mongomodels.classroom
        .findOne({ _id: classroomId, schoolId: user.schoolId })
        .lean();
      if (!classroom)
        this.utils.throwError(
          "Target classroom does not exist or does not belong to your school.",
          404
        );

      // Update the student's classroom
      const updatedStudent = await this.mongomodels.student.findByIdAndUpdate(
        studentId,
        { classroomId, updatedBy: user._id },
        { new: true, runValidators: true, lean: true }
      );

      if (!updatedStudent)
        this.utils.throwError("Failed to transfer student.", 400);

      return this.utils.returnSuccess("Student transferred successfully.", {
        student: updatedStudent,
      });
    } catch (error) {
      return this.utils.returnError("Failed to transfer student", error);
    }
  }

  /** Delete student by ID */
  async delete({ __auth, __isSchoolAdmin, __params }) {
    try {
      const { user } = __auth;
      const { id } = __params;

      this.utils.logger(
        "INFO",
        `Attempting to delete student with ID: ${id} for schoolId: ${user.schoolId}`
      );

      // Find and delete the student, ensuring they belong to the authenticated user's school
      const deletedStudent = await this.mongomodels.student
        .findOneAndDelete({ _id: id, schoolId: user.schoolId })
        .lean();

      if (!deletedStudent)
        this.utils.throwError(
          "Student not found or does not belong to your school.",
          404
        );

      return this.utils.returnSuccess("Student deleted successfully.");
    } catch (error) {
      return this.utils.returnError("Failed to delete student", error);
    }
  }
};
