const mongoose = require("mongoose");

const ImageRecognitionSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    detectedItems: [
        {
            label: {
                type: String,
                required: true,
            },
            confidence: {
                type: Number,
                required: true,
            },
            mappedItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item",
            },
        },
    ],
    scanDate: {
        type: Date,
        default: Date.now,
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    scanLocation: {
        type: String,
        enum: ["refrigerator", "freezer", "dry storage", "prep area", "other"],
        default: "other",
    },
});

module.exports = mongoose.model("ImageRecognition", ImageRecognitionSchema);
