// models/Item.js - Schema for inventory items
const mongoose = require("mongoose");

const categoryExpiryMap = {
    'fruits': 5,
    'vegetable': 7,
    'dry food': 180,
    'dairy': 14,
    'meat': 7,
    'produce': 7,
    'spices': 365,
    'other': 30  // Default for unspecified categories
  };

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
            "dry food",
            "spices",
            "fruits",
            "vegetable",
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
        default: 0,
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

ItemSchema.pre('save', function(next) {
    if (!this.expiryDate) {
        const expiryDays = categoryExpiryMap[this.category] || 30;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);
        this.expiryDate = expiryDate;
    }
    next();
});

// Update daysUntilExpiry virtual property
ItemSchema.virtual("daysUntilExpiry").get(function () {
    if (!this.expiryDate) return null;
    const diffTime = this.expiryDate - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});


module.exports = mongoose.model("Item", ItemSchema);
