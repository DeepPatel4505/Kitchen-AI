const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
    },
    predictionType: {
        type: String,
        enum: ["demand", "waste", "inventory", "menu"],
        required: true,
    },
    predictions: [
        {
            date: {
                type: Date,
                required: true,
            },
            value: {
                type: Number,
                required: true,
            },
            confidence: {
                type: Number,
                min: 0,
                max: 1,
                default: 0.7,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    metadata: {
        type: Map,
        of: String,
    },
});

module.exports = mongoose.model("Prediction", PredictionSchema);
