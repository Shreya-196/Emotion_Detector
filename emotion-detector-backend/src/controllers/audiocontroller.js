import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const HUGGINGFACE_API_URL = process.env.HUGGINGFACE_API_URL || "https://sezzzz1105-emotionapi.hf.space";
export const analyzeEmotion = async (req, res) => {
    if (!req.file) {
        console.error("❌ No audio file uploaded.");
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    const filePath = req.file.path;

    try {
        console.log(`📤 Sending audio file: ${filePath} to Flask API`);

        const formData = new FormData();
        formData.append("audio", fs.createReadStream(filePath));

        // Send request to Hugging Face API
        const response = await axios.post(`${HUGGINGFACE_API_URL}/predict`, formData, {
            headers: { 
                ...formData.getHeaders(),
                'Accept': 'application/json'
            },
            timeout: 60000 // 60 second timeout
        });

        console.log("✅ Hugging Face API Response:", response.data);

        res.json(response.data);
    } catch (error) {
        console.error("❌ Error communicating with Hugging Face API:", error.response?.data || error.message);
        
        // Fallback error handling
        if (error.code === 'ECONNABORTED') {
            res.status(408).json({ error: "Request timeout. Please try again." });
        } else if (error.response?.status === 503) {
            res.status(503).json({ error: "ML service temporarily unavailable. Please try again later." });
        } else {
            res.status(500).json({ error: "Failed to get emotion analysis" });
        }
    } finally {
        // Cleanup: Ensure file is deleted after processing
        try {
            await fs.promises.unlink(filePath);
            console.log(`🗑️ Deleted uploaded file: ${filePath}`);
        } catch (err) {
            console.error("⚠️ Error deleting file:", err);
        }
    }
};
