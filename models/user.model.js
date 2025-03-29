import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // If googleId is absent, password is required
            },
        },
        role: {
            type: String,
            enum: ["patient", "clinic_admin", "doctor"],
            required: true,
            default: "patient",
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
        discriminatorKey: "role",
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;