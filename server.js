import app from "./app.js";
import connectDB from "./config/db.js";
import cloudinary from "cloudinary";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from "fs";
import path from "path"
// Define __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsPath = join(__dirname, 'uploads');
const framesPath = join(__dirname, 'frames');

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .then(() => {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });
    })
    .then(() => {
        setInterval(() => {
            console.log("Running scheduled cleanup");
            [uploadsPath, framesPath].forEach((dir) => {
                try {
                    if (fs.existsSync(dir)) {
                        fs.readdirSync(dir).forEach((file) => {
                            const filePath = path.join(dir, file);
                            const stats = fs.statSync(filePath);

                            // Delete files older than 1 hour (3600000 ms)
                            if (Date.now() - stats.mtimeMs > 3600000) {
                                fs.rmSync(filePath, {
                                    recursive: true,
                                    force: true,
                                });
                                console.log(`Cleaned: ${filePath}`);
                            }
                        });
                    }
                } catch (err) {
                    console.error(`Cleanup error in ${dir}:`, err);
                }
            });
        }, 1*60*60*1000);
    })
    .catch((err) => {
        console.error(err);
    });
