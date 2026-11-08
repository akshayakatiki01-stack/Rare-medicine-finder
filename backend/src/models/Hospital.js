import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true,
},


address: {
  type: String,
  required: true,
  trim: true,
},

city: {
  type: String,
  required: true,
  trim: true,
},

district: {
  type: String,
  trim: true,
},

state: {
  type: String,
  required: true,
  trim: true,
},

phone: {
  type: String,
  required: true,
  trim: true,
},

emergencyServices: {
  type: [String],
  default: [],
},

hasEmergencyDepartment: {
  type: Boolean,
  default: false,
},

hasAntivenomService: {
  type: Boolean,
  default: false,
},

isVerified: {
  type: Boolean,
  default: false,
},

lastAvailabilityUpdated: {
  type: Date,
  default: null,
},


},
{
timestamps: true,
}
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
