import express from "express";
import Medicine from "../models/Medicine.js";

const router = express.Router();

// 1. Get all medicines
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
      error: error.message,
    });
  }
});

// 2. Search medicines by name
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
      error: error.message,
    });
  }
});

// 3. Get medicine by ID
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid medicine ID",
    });
  }
});

// 4. Add a medicine
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

// 5. Update medicine by ID
router.put("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not update medicine",
      error: error.message,
    });
  }
});

// 6. Delete medicine by ID
router.delete("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      data: medicine,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not delete medicine",
      error: error.message,
    });
  }
});

export default router;

