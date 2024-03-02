import { AppError } from "../utils/AppError.js";

export const createPostValidation = async (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return next(new AppError(400, "All fields are required"));
    }
    next();
};
