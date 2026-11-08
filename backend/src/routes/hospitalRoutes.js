import express from "express";
import Hospital from "../models/Hospital.js";

const router = express.Router();

// GET all hospitals
router.get("/", async (req, res) => {
try {
const hospitals = await Hospital.find().sort({ createdAt: -1 });


res.status(200).json({
  success: true,
  count: hospitals.length,
  data: hospitals,
});


} catch (error) {
res.status(500).json({
success: false,
message: "Unable to fetch hospitals",
error: error.message,
});
}
});

// SEARCH hospitals by city
router.get("/city/:city", async (req, res) => {
try {
const hospitals = await Hospital.find({
city: { $regex: req.params.city, $options: "i" },
});


res.status(200).json({
  success: true,
  count: hospitals.length,
  data: hospitals,
});


} catch (error) {
res.status(500).json({
success: false,
message: "Hospital search failed",
error: error.message,
});
}
});

// GET hospital by ID
router.get("/:id", async (req, res) => {
try {
const hospital = await Hospital.findById(req.params.id);


if (!hospital) {
  return res.status(404).json({
    success: false,
    message: "Hospital not found",
  });
}

res.status(200).json({
  success: true,
  data: hospital,
});


} catch (error) {
res.status(400).json({
success: false,
message: "Invalid hospital ID",
});
}
});

// ADD hospital
router.post("/", async (req, res) => {
try {
const hospital = await Hospital.create(req.body);


res.status(201).json({
  success: true,
  message: "Hospital registered successfully",
  data: hospital,
});


} catch (error) {
res.status(400).json({
success: false,
message: "Unable to register hospital",
error: error.message,
});
}
});

export default router;
