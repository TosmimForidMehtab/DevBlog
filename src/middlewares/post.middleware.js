import { AppError } from "../utils/AppError.js";

export const createPostValidation = async (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return next(new AppError(400, "All fields are required"));
    }
    next();
};

export const validatePostId = (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new AppError(400, "Post id is required"));
    }

    next();
};

export const updatePostValidation = async (req, res, next) => {
    const { title, content, category, image } = req.body;

    if (!title && !content && !category && !image) {
        console.log(req.body);
        return next(new AppError(400, "Atleast one field is required"));
    }

    next();
};
