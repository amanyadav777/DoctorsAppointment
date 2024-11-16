const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    website: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    specialization: {
      type: String,
      require: true,
    },
    experience: {
      type: String,
      require: true,
    },
    feePerConsultation: {
      type: Number,
      require: true,
    },
    timings: {
      type: Array,
      require: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("doctors", doctorSchema);

module.exports = doctorModel;
