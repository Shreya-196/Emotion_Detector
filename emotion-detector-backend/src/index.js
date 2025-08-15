import "dotenv/config"; // Load environment variables
import express from "express";
import cors from "cors";
import audioRoutes from "./routes/audioroutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/audio", audioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
