import "./config/config.js";
import express, { urlencoded, json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import verifyRoutes from "./routes/verifyRoutes.js";
<<<<<<< HEAD
import videoRoutes from "./routes/videoRoutes.js";
=======
import predictRoutes from "./routes/predictRoutes.js";
>>>>>>> 811f5a0d8006bce4f4a3c368bd80e02b10126139

import errorMiddleware from "./middleware/error.js";
import { isAuthenticated } from "./middleware/auth.js";
import multer from './middleware/mullter.js'

import { connectPassport } from "./utils/googleAuthProvider.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET || "sdfghjkldghj",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 5,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
connectPassport();

// Static File Serving
app.use("/processed", express.static(path.join(__dirname, "frames")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    return res.json({ msg: "Done" }); // Fix: use res.json() to send a response
});

app.use("/api/v1/verify", verifyRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", isAuthenticated, userRoutes);
<<<<<<< HEAD
app.use("/api/v1/video", videoRoutes);
=======
app.use("/api/v1/predict", predictRoutes);

>>>>>>> 811f5a0d8006bce4f4a3c368bd80e02b10126139

//Error Handler
app.use(errorMiddleware);

process.on("SIGINT", () => {
    console.log("Cleaning up temporary files...");
    fs.rmSync(path.join(__dirname, "uploads"), {
        recursive: true,
        force: true,
    });
    fs.rmSync(path.join(__dirname, "frames"), { recursive: true, force: true });
    process.exit();
});

export default app;
