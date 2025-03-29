// models/Recipe.js - Schema for recipes
const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: [
        {
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
            }
        },
    ],
    sellingPrice: {
        type: Number,
        required: true,
    },
    popularity: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    imageUrl: {
        type: String,
    },
    category: {
        type: String,
        enum: ["appetizer", "main course", "dessert", "beverage", "special"],
        default: "main course",
    },
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Calculate recipe cost based on ingredients
RecipeSchema.virtual("cost").get(function () {
    if (!this.populated("ingredients.item")) {
        return null; // Need to populate items first
    }

    return this.ingredients.reduce((total, ingredient) => {
        return total + ingredient.item.costPerUnit * ingredient.quantity;
    }, 0);
});

// Calculate profit margin
RecipeSchema.virtual("profitMargin").get(function () {
    const cost = this.cost;
    if (cost === null) return null;

    return ((this.sellingPrice - cost) / this.sellingPrice) * 100;
});

module.exports = mongoose.model("Recipe", RecipeSchema);
