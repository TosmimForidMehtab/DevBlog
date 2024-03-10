import { User } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { mailer } from "../utils/mailer.js";
import jwt from "jsonwebtoken";

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
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;

        const sortDirection = req.query.sort === "asc" ? 1 : -1;

        const users = await User.find().select("-password").sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

        const totalUsers = await User.countDocuments();

        const now = new Date();
        const lastMonthUsers = await User.countDocuments({
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
                $lte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            },
        });
        res.status(200).json(new ApiResponse(200, "Users fetched successfully", { users, totalUsers, lastMonthUsers }));
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
            httpOnly: false,
            secure: false,
            sameSite: "none",
        };
        const { password: _, ...rest } = user._doc;
        rest.token = token;
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
        const { id } = req.params;
        let user;
        if (email || username) {
            user = await User.findOne({ $or: [{ email }, { username }] });
        } else if (id) {
            user = await User.findById(id);
            console.log(user);
        }

        if (!user) {
            // console.log(id);
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
    if (!req.user.isAdmin && req.params.id !== req.user._id.toString()) {
        return next(new AppError(401, "You are not authorized to delete this user"));
    }
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
                httpOnly: false,
                secure: false,
                sameSite: "none",
            };
            const { password: _, ...rest } = user._doc;
            rest.token = token;
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
                httpOnly: false,
                secure: false,
                sameSite: "none",
            };
            const { password: _, ...rest } = newUser._doc;
            rest.token = token;
            res.cookie("accessToken", token, options);
            return res.status(200).json(new ApiResponse(200, "User signed in successfully", rest));
        }
    } catch (error) {
        return next(new AppError(error.statusCode, error.message));
    }
};

export const updateUser = async (req, res, next) => {
    if (req.user._id.toString() !== req.params.id) {
        return next(new AppError(403, "You are unauthorized to update this resource"));
    }
    try {
        const { username, email, password, profilePic } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username,
                    email,
                    password,
                    profilePic,
                },
            },
            { new: true }
        ).select("-password");
        res.status(200).json(new ApiResponse(200, "User updated successfully", user));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const signOut = (req, res, next) => {
    try {
        res.clearCookie("accessToken").status(200).json(new ApiResponse(200, "User signed out successfully"));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const sendOtp = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError(404, "User not found"));
        }
        const otp = mailer(email);
        const otpToken = jwt.sign({ otp }, process.env.OTP_SECRET, {
            expiresIn: "10m",
        });
        user.otp = otpToken;
        await user.save();
        return res.status(200).json(new ApiResponse(200, "OTP sent successfully", null));
        // next();
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        if (!otp) {
            return next(new AppError(400, "OTP must be provided"));
        }
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError(404, "User not found"));
        }
        const decodedOtp = jwt.verify(user.otp, process.env.OTP_SECRET);
        if (parseInt(decodedOtp.otp) !== parseInt(otp)) {
            return next(new AppError(400, "Invalid OTP"));
        }

        user.otp = null;
        user.isAdmin = true;
        await user.save();

        return res.status(200).json(new ApiResponse(200, "OTP verified successfully", null));
    } catch (error) {
        if (error.message === "jwt must be provided") {
            console.log(error);
            return next(new AppError(400, "OTP must be provided"));
        }
        if (error.message === "jwt expired") {
            return next(new AppError(400, "OTP expired"));
        }
        return next(new AppError(error.statusCode, error.message));
    }
};
