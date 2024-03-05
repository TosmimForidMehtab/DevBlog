import { AppError } from "../utils/AppError.js";

export const createCommentValidation = (req, res, next) => {
    const { content, userId, postId } = req.body;

    if (!content || !userId || !postId) {
        return next(new AppError(400, "All fields are required"));
    }

    next();
};
