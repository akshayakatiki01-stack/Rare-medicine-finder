import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import medicineRequestRoutes from "./routes/medicineRequestRoutes.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

dotenv.config({
  path: path.resolve(currentDirectory, "../../.env"),
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/medicines", medicineRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/medicine-requests", medicineRequestRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Rare Medicine Finder API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database: "Connected",
  });
});

async function startServer() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();