import express from "express";
import mongoose from "mongoose";
import MedicineRequest from "../models/MedicineRequest.js";

const router = express.Router();

// 1. Create a medicine request
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
        success: false,
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
      success: true,
      message: "Medicine request created successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create medicine request",
      error: error.message,
    });
  }
});

// 2. Get all medicine requests
router.get("/", async (req, res) => {
  try {
    const requests = await MedicineRequest.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medicine requests",
      error: error.message,
    });
  }
});

// 3. Get medicine request by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    const request = await MedicineRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Medicine request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve medicine request",
      error: error.message,
    });
  }
});

// 4. Update medicine request by ID
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    const allowedFields = [
      "medicineName",
      "genericName",
      "strength",
      "dosageForm",
      "city",
      "contactEmail",
      "notes",
      "status",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const request = await MedicineRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Medicine request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicine request updated successfully",
      data: request,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Could not update medicine request",
      error: error.message,
    });
  }
});

// 5. Delete medicine request by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    const request = await MedicineRequest.findByIdAndDelete(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Medicine request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicine request deleted successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not delete medicine request",
      error: error.message,
    });
  }
});

export default router;

