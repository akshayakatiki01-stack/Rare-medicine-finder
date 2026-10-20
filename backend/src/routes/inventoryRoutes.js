import express from "express";
import mongoose from "mongoose";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// GET: Retrieve all inventory records
router.get("/", async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate("medicine")
      .populate("pharmacy");

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve inventory",
    });
  }
});

// GET: Find inventory for a specific medicine
router.get("/medicine/:medicineId", async (req, res) => {
  try {
    const { medicineId } = req.params;

    if (!mongoose.isValidObjectId(medicineId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const inventory = await Inventory.find({
      medicine: medicineId,
    }).populate("medicine pharmacy");

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search inventory",
    });
  }
});

// POST: Add an inventory record
router.post("/", async (req, res) => {
  try {
    const {
      medicine,
      pharmacy,
      price,
      availabilityStatus,
      quantity,
      verified,
      source,
    } = req.body;

    if (
      !mongoose.isValidObjectId(medicine) ||
      !mongoose.isValidObjectId(pharmacy)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid medicine and pharmacy IDs are required",
      });
    }

    if (price === undefined || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number",
      });
    }

    const medicineExists = await mongoose.model("Medicine").exists({
      _id: medicine,
    });

    const pharmacyExists = await mongoose.model("Pharmacy").exists({
      _id: pharmacy,
    });

    if (!medicineExists || !pharmacyExists) {
      return res.status(404).json({
        success: false,
        message: "Medicine or pharmacy not found",
      });
    }

    const inventory = await Inventory.create({
      medicine,
      pharmacy,
      price,
      availabilityStatus,
      quantity,
      // Do not allow clients to self-verify inventory.
      verified: false,
      source: "sample_data",
      lastUpdated: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Inventory record created as unverified data",
      data: inventory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An inventory record already exists for this medicine and pharmacy",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create inventory record",
    });
  }
});

export default router;