import express from "express";
import mongoose from "mongoose";
import Pharmacy from "../models/Pharmacy.js";

const router = express.Router();

// 1. Get all pharmacies
router.get("/", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: pharmacies.length,
      data: pharmacies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve pharmacies",
      error: error.message,
    });
  }
});

// 2. Search pharmacies by city
router.get("/city/:city", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({
      city: { $regex: req.params.city, $options: "i" },
    });

    res.status(200).json({
      success: true,
      count: pharmacies.length,
      data: pharmacies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Pharmacy search failed",
      error: error.message,
    });
  }
});

// 3. Get pharmacy by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pharmacy ID",
      });
    }

    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve pharmacy",
    });
  }
});

// 4. Add a pharmacy
router.post("/", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);

    res.status(201).json({
      success: true,
      message: "Pharmacy added successfully",
      data: pharmacy,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not add pharmacy",
      error: error.message,
    });
  }
});

// 5. Update pharmacy by ID
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pharmacy ID",
      });
    }

    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pharmacy updated successfully",
      data: pharmacy,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not update pharmacy",
      error: error.message,
    });
  }
});

// 6. Delete pharmacy by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pharmacy ID",
      });
    }

    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pharmacy deleted successfully",
      data: pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not delete pharmacy",
      error: error.message,
    });
  }
});

export default router;
