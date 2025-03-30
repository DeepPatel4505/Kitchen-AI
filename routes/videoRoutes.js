import express from "express";
import ffmpeg from "fluent-ffmpeg";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import ffmpegStatic from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegStatic);

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "uploads");
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 100 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed!"), false);
        }
    },
});

// Frame Extraction Endpoint
router.post("/extract-frames", upload.single("video"), async (req, res) => {
    try {
        const videoPath = req.file.path;
        const outputDir = path.join(process.cwd(), "frames", uuidv4());
        const interval = 10; // Seconds

        // Create output directory
        fs.mkdirSync(outputDir, { recursive: true });

        // FFmpeg Processing
        const command = ffmpeg(videoPath)
            .outputOptions([
                "-vf fps=1/10", // 1 frame every 10 seconds
                "-q:v 2", // Quality level
                "-frame_pts true", // Use presentation timestamps
            ])
            .output(path.join(outputDir, "frame_%04d.jpg"))
            .on("start", (commandLine) => {
                console.log(`FFmpeg command: ${commandLine}`);
            })
            .on("progress", (progress) => {
                console.log(
                    `Processing: ${Math.floor(progress.percent)}% done`
                );
            })
            .on("end", () => {
                const frames = fs.readdirSync(outputDir).map((file, index) => ({
                    url: `/processed/${path.basename(outputDir)}/${file}`,
                    timestamp: `${index * interval} seconds`,
                    downloadUrl: `/processed/${path.basename(
                        outputDir
                    )}/${file}`,
                    filename: file,
                }));

                console.log(`Successfully processed ${frames.length} frames`);
                res.json({ success: true, frames });
            })
            .on("error", (err) => {
                console.error("FFmpeg Error:", err);
                res.status(500).json({
                    success: false,
                    error: "Frame extraction failed",
                    details: err.message,
                });
            });

        command.run();
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            details: err.message,
        });
    }
});

export default router;
