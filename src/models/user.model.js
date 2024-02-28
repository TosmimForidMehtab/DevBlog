import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: [true, `User already exists`],
            minlength: [3, "Username must be at least 3 characters long"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            validate: {
                validator: (value) => {
                    return validator.isStrongPassword(value, {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    });
                },
            },
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, `User with email already exists`],
            validate: {
                validator: (value) => {
                    return validator.isEmail(value);
                },
            },
        },
        profilePic: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = async function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);
