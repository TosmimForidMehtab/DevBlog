import { User } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const existingInfo = existingUser?.username === username ? username : email;
            return next(new AppError(409, `User ${existingInfo} already exists`));
        }
        const user = await User.create({ username, email, password });
        res.status(201).json(new ApiResponse(201, "User created successfully", user));
    } catch (error) {
        if (error.name === "ValidationError") {
            error.message = "Invalid input";
            error.statusCode = 400;
        }
        if (error.name === "CastError") {
            error.message = "User not found";
            error.statusCode = 404;
        }
        next(new AppError(error.statusCode, error.message));
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError(404, "User not found"));
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new AppError(401, "Invalid credentials"));
        }
        const token = await user.generateToken();
        const options = {
            maxAge: 1000 * 60 * 60 * 24 * 4,
            httpOnly: true,
            // secure: true,
        };
        const { password: _, ...rest } = user._doc;
        res.cookie("accessToken", token, options);

        res.status(200).json(new ApiResponse(200, "User signed in successfully", rest));
    } catch (error) {
        if (error.name === "ValidationError") {
            error.message = "Invalid input";
            error.statusCode = 400;
        }
        if (error.name === "CastError") {
            error.message = "User not found";
            error.statusCode = 404;
        }
        next(new AppError(error.statusCode, error.message));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] }).select("-password");
        if (!user) {
            return next(new AppError(404, "User not found"));
        }
        res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
    } catch (error) {
        if (error.name === "ValidationError") {
            error.message = "Invalid input";
            error.statusCode = 400;
        }
        if (error.name === "CastError") {
            error.message = "User not found";
            error.statusCode = 404;
        }
        next(new AppError(error.statusCode, error.message));
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(new ApiResponse(200, "User deleted successfully", user));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const googleAuth = async (req, res, next) => {
    const { username, email, photo } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = await user.generateToken();
            const options = {
                maxAge: 1000 * 60 * 60 * 24 * 4,
                httpOnly: true,
                // secure: true,
            };
            const { password: _, ...rest } = user._doc;
            res.cookie("accessToken", token, options);
            return res.status(200).json(new ApiResponse(200, "User signed in successfully", rest));
        } else {
            const password = Math.random().toString(36).slice(-8) + "@Google";
            const newUser = await User.create({
                username: username.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-3),
                email,
                password,
                profilePic: photo,
            });
            const token = await newUser.generateToken();
            const options = {
                maxAge: 1000 * 60 * 60 * 24 * 4,
                httpOnly: true,
                // secure: true,
            };
            const { password: _, ...rest } = newUser._doc;
            res.cookie("accessToken", token, options);
            return res.status(200).json(new ApiResponse(200, "User signed in successfully", rest));
        }
    } catch (error) {
        return next(new AppError(error.statusCode, error.message));
    }
};
