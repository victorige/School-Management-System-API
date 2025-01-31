const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the student schema
const studentSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true, // Index for faster queries by schoolId
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      index: true, // Index for quick lookups of students in a classroom
    },
    firstName: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
      minlength: [2, "First name must be at least 2 characters long."],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long."],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address.",
      ],
    },
    enrollmentDate: {
      type: Date,
      required: true,
      default: Date.now, // Automatically sets the date to now if not provided
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
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Student model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
