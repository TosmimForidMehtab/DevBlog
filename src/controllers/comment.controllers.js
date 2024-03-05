import { Comment } from "../models/comment.model.js";
import { AppError } from "../utils/appError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const createComment = async (req, res, next) => {
    try {
        const { content, userId, postId } = req.body;
        if (userId !== req.user._id.toString()) {
            return next(new AppError(401, "You are not authorized to perform this action"));
        }
        const newComment = await Comment.create({
            content,
            userId,
            postId,
        });
        res.status(201).json(new ApiResponse(201, "Comment created successfully", newComment));
    } catch (error) {
        if (error.name === "ValidationError") {
            error.message = "Invalid input";
            error.statusCode = 400;
        }

        if (error.name === "CastError") {
            error.message = "Post not found";
            error.statusCode = 404;
        }
        next(new AppError(error.statusCode, error.message));
    }
};

export const getComment = async (req, res, next) => {
    try {
        const comment = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
        if (comment.length === 0) {
            return res.status(200).json(new ApiResponse(200, "No comments found", comment));
        }
        res.status(200).json(new ApiResponse(200, "Comment fetched successfully", comment));
    } catch (error) {
        console.log(error);
        next(new AppError(error.statusCode, error.message));
    }
};
