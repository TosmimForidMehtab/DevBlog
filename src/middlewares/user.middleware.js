import { AppError } from "../utils/AppError.js";
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
    if (!email || !username) {
        return res.status(400).json(new AppError(400, "Atleast one field is required"));
    }
    next();
};
