import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, "../data/dataset.csv");

export async function loadMusicData() {
    return new Promise((resolve, reject) => {
        const musicData = [];
        fs.createReadStream(datasetPath)
            .pipe(csv())
            .on("data", (row) => {
                musicData.push(row);
            })
            .on("end", () => {
                console.log("✅ Music dataset loaded!");
                resolve(musicData);
            })
            .on("error", (err) => reject(err));
    });
}
