import express from "express";
import { loadMusicData } from "../utils/loadData.js";

const router = express.Router();
let musicDataset = [];

(async () => {
    musicDataset = await loadMusicData();
})();

// Emotion to Spotify recommendation mapping
const emotionToGenre = {
    happiness: ["pop", "dance", "happy"],
    sadness: ["acoustic", "soft rock", "blues"],
    anger: ["metal", "rock", "hardcore"],
    fear: ["ambient", "electronic", "dark"],
    love: ["romantic", "soul", "r&b"],
    excitement: ["edm", "party", "electronic"]
};

// Function to filter songs based on emotion
const recommendSongs = (emotion) => {
    const genres = emotionToGenre[emotion.toLowerCase()] || [];
    return musicDataset.filter(song => genres.includes(song.track_genre)).slice(0, 5);
};

// API Route to get recommendations based on detected emotion
router.post("/recommend", (req, res) => {
    const { emotion } = req.body;

    if (!emotion) {
        return res.status(400).json({ error: "Emotion is required" });
    }

    const recommendedSongs = recommendSongs(emotion);
    
    if (recommendedSongs.length === 0) {
        return res.json({ message: "No songs found for this emotion." });
    }

    res.json({ recommendations: recommendedSongs });
});

export default router;
