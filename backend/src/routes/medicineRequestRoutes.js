
import express from "express";
import MedicineRequest from "../models/MedicineRequest.js";

const router = express.Router();

// Create a medicine request
router.post("/", async (req, res) => {
  try {
    const {
      medicineName,
      genericName,
      strength,
      dosageForm,
      city,
      contactEmail,
      notes,
    } = req.body;

    if (!medicineName || !city) {
      return res.status(400).json({
        message: "Medicine name and city are required",
      });
    }

    const request = await MedicineRequest.create({
      medicineName,
      genericName,
      strength,
      dosageForm,
      city,
      contactEmail,
      notes,
    });

    return res.status(201).json({
      message: "Medicine request created successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create medicine request",
      error: error.message,
    });
  }
});

// Get all medicine requests
router.get("/", async (req, res) => {
  try {
    const requests = await MedicineRequest.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch medicine requests",
      error: error.message,
    });
  }
});

export default router;
