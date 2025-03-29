// models/Item.js - Schema for inventory items
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            "produce",
            "dairy",
            "meat",
            "seafood",
            "dry goods",
            "spices",
            "other",
        ],
        default: "other",
    },
    currentQuantity: {
        type: Number,
        required: true,
        default: 0,
    },
    unit: {
        type: String,
        required: true,
        enum: ["kg", "g", "l", "ml", "pcs", "lbs", "oz"],
        default: "pcs",
    },
    minThreshold: {
        type: Number,
        default: 5,
    },
    costPerUnit: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String,
    },
    salesHistory: [
        {
            date: {
                type: Date,
                default: Date.now,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

// Calculate if item is low on stock
ItemSchema.virtual("isLowStock").get(function () {
    return this.currentQuantity <= this.minThreshold;
});

// Calculate days until expiry
ItemSchema.virtual("daysUntilExpiry").get(function () {
    if (!this.expiryDate) return null;
    const diffTime = this.expiryDate - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model("Item", ItemSchema);
