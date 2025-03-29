import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Get logged-in user details
router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});






export default router;
