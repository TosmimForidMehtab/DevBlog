import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";
import jwt from "jsonwebtoken";
import validator from "validator";
export const validateCreateUser = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json(new AppError(400, "All fields are required"));
    }
    next();
};

export const validateSignIn = (req, res, next) => {
    const { email, password } = req.body;
    if ([email, password].includes(undefined)) {
        return res.status(400).json(new AppError(400, "All fields are required"));
    }
    next();
};

export const vlaidateGetUser = (req, res, next) => {
    const { email, username } = req.body;
    if (!(email || username || req.params.id)) {
        return res.status(400).json(new AppError(400, "Atleast one field is required"));
    }
    next();
};

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
    if (!token) {
        return res.status(401).json(new AppError(401, "Unauthorized"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json(new AppError(401, "Unauthorized"));
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json(new AppError(401, "Token expired. Please login again"));
        }
        return res.status(401).json(new AppError(401, "Unauthorized"));
    }
};

export const validateUserId = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json(new AppError(400, "User id is required"));
    }
    next();
};

export const validateUpdateUser = (req, res, next) => {
    const { username, email, password } = req.body;
    // if (!username && !email && !password) {
    //     return res.status(400).json(new AppError(400, "Atleast one field is required"));
    // }
    if (username && username.length < 3) {
        return res.status(400).json(new AppError(400, "Username must be at least 3 characters long"));
    }
    if (username && username.includes([" ", "@", ".", "#", "$", "%", "^", "&", "*", "(", ")", "-"])) {
        return res.status(400).json(new AppError(400, "Username cannot contain spaces or special characters."));
    }
    if (email && !validator.isEmail(email)) {
        return res.status(400).json(new AppError(400, "Invalid email address"));
    }
    if (
        password &&
        !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
    ) {
        return res.status(400).json(new AppError(400, "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."));
    }
    next();
};

export const verifyAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(401).json(new AppError(401, "You are not authorized to perform this action"));
    }
    // console.log(req.user);
    next();
};
