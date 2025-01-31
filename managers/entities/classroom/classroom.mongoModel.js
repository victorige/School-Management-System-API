const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the classroom schema
const classroomSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true, // Index for faster lookup by schoolId
    },
    name: {
      type: String,
      required: true,
      trim: true, // Ensures no leading/trailing spaces
      minlength: [3, "Classroom name must be at least 3 characters long."],
    },
    capacity: {
      type: Number,
      required: true,
    },
    resources: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.every(
            (resource) => typeof resource === "string" && resource.length > 0
          );
        },
        message: "Each resource should be a non-empty string.",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create the Classroom model
const Classroom = mongoose.model("Classroom", classroomSchema);

module.exports = Classroom;
