const mongoose = require("mongoose");

const WasteSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        enum: ["expired", "spoiled", "over-produced", "damaged", "other"],
        default: "other",
    },
    notes: {
        type: String,
    },
    costValue: {
        type: Number,
    },
    wasteDate: {
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String,
    },
});

module.exports = mongoose.model("Waste", WasteSchema);
