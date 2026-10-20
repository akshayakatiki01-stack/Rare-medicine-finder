import express from "express";
import pharmacy from "../models/pharmacy.js";

const router = express.Router();

// Get all pharmacies
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
    });
  }
});

// Search pharmacies by city
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
    });
  }
});

// Add a pharmacy
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

export default router;