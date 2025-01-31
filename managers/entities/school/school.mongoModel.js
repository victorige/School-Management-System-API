const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the school schema
const schoolSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?\d{10,15}$/, "Please enter a valid phone number"],
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

// Create the School model
const School = mongoose.model("School", schoolSchema);

module.exports = School;
