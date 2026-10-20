import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    genericName: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    strength: {
      type: String,
      trim: true,
    },

    dosageForm: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    requiresPrescription: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;