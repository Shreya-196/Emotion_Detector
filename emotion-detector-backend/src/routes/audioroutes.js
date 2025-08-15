import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { analyzeEmotion } from "../controllers/audiocontroller.js";

const router = express.Router();

// Define absolute path for the "uploads" folder
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure the folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Created 'uploads/' folder at root level");
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Route for audio file upload
router.post("/upload", upload.single("audio"), analyzeEmotion);

export default router;
