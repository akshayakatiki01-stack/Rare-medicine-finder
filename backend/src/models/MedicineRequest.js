import mongoose from "mongoose";

const medicineRequestSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    genericName: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    strength: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    dosageForm: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    status: {
      type: String,
      enum: ["open", "matched", "fulfilled", "cancelled"],
      default: "open",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const MedicineRequest = mongoose.model(
  "MedicineRequest",
  medicineRequestSchema
);

export default MedicineRequest;