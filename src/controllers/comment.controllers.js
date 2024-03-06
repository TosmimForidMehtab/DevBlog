import { Comment } from "../models/comment.model.js";
import { AppError } from "../utils/AppError.js";
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

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            console.log(req.params.id);
            return next(new AppError(404, "Comment not found"));
        }

        if (comment.likes.includes(req.user._id)) {
            const index = comment.likes.indexOf(req.user._id);
            comment.likes.splice(index, 1);
            comment.numberOfLikes--;
        } else {
            comment.likes.push(req.user._id);
            comment.numberOfLikes++;
        }

        await comment.save();

        res.status(200).json(new ApiResponse(200, "Comment liked successfully", comment));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const editComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) {
            return next(new AppError(400, "Content is required"));
        }
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(new AppError(404, "Comment not found"));
        }

        if (comment.userId !== req.user._id.toString() && !req.user.isAdmin) {
            return next(new AppError(401, "You are not authorized to perform this action"));
        }
        comment.content = content;
        await comment.save();
        res.status(200).json(new ApiResponse(200, "Comment edited successfully", comment));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(new AppError(404, "Comment not found"));
        }

        if (comment.userId !== req.user._id.toString() && !req.user.isAdmin) {
            return next(new AppError(401, "You are not authorized to perform this action"));
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json(new ApiResponse(200, "Comment deleted successfully", null));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const getAllComments = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;

        const sortDirection = req.query.sort === "asc" ? 1 : -1;
        const comments = await Comment.find().sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const lastMonthComments = await Comment.countDocuments({
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
                $lte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            },
        });

        res.status(200).json(new ApiResponse(200, "Comments fetched successfully", { comments, totalComments, lastMonthComments }));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};
