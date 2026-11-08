import express from "express";
import mongoose from "mongoose";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// 1. GET: Retrieve all inventory records
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
      error: error.message,
    });
  }
});

// 2. GET: Search inventory by medicine name
router.get("/search", async (req, res) => {
  try {
    const name = req.query.name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a medicine name using ?name=",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Medicine name must be 100 characters or fewer",
      });
    }

    const Medicine = mongoose.model("Medicine");

    const medicines = await Medicine.find({
      name: { $regex: name, $options: "i" },
    });

    if (medicines.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No matching medicines found",
        count: 0,
        data: [],
      });
    }

    const medicineIds = medicines.map((medicine) => medicine._id);

    const inventory = await Inventory.find({
      medicine: { $in: medicineIds },
    }).populate("medicine pharmacy");

    const results = inventory.map((item) => ({
      medicine: item.medicine,
      pharmacy: item.pharmacy,
      price: item.price,
      availabilityStatus: item.availabilityStatus,
      verified: item.verified,
      source: item.source,
      lastUpdated: item.lastUpdated,
    }));

    res.status(200).json({
      success: true,
      count: results.length,
      message: "Matching inventory records retrieved",
      data: results,
    });
  } catch (error) {
    console.error("Medicine inventory search failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to search medicine inventory",
    });
  }
});

// 3. GET: Find inventory for a specific medicine
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

// 4. GET: Find inventory by inventory ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    const inventory = await Inventory.findById(req.params.id)
      .populate("medicine")
      .populate("pharmacy");

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve inventory",
    });
  }
});

// 5. POST: Add an inventory record
router.post("/", async (req, res) => {
  try {
    const {
      medicine,
      pharmacy,
      price,
      availabilityStatus,
      quantity,
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

    if (
      price === undefined ||
      !Number.isFinite(price) ||
      price < 0
    ) {
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

// 6. PUT: Update inventory by ID
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    const allowedFields = [
      "price",
      "availabilityStatus",
      "quantity",
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

    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        ...updateData,
        lastUpdated: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("medicine")
      .populate("pharmacy");

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not update inventory",
      error: error.message,
    });
  }
});

// 7. DELETE: Delete inventory by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory deleted successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not delete inventory",
    });
  }
});

export default router;

