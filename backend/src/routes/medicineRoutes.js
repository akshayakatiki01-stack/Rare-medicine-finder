import express from "express";
import Medicine from "../models/Medicine.js";

const router = express.Router();

// Get all medicines
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve medicines",
    });
  }
});

// Search medicines by name
router.get("/search", async (req, res) => {
  try {
    const query = req.query.name?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a medicine name",
      });
    }

    const medicines = await Medicine.find({
      name: { $regex: query, $options: "i" },
    });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Medicine search failed",
    });
  }
});

// Add a medicine
router.post("/", async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not add medicine",
      error: error.message,
    });
  }
});

export default router;