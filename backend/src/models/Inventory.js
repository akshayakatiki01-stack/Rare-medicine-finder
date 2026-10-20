import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "low_stock", "out_of_stock", "unknown"],
      default: "unknown",
    },

    quantity: {
      type: Number,
      min: 0,
      default: null,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      enum: ["pharmacy_report", "sample_data", "admin_report"],
      default: "sample_data",
    },
  },
  { timestamps: true }
);

inventorySchema.index({ medicine: 1, pharmacy: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;