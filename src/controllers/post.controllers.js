import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const createPost = async (req, res, next) => {
    const { title, content, category } = req.body;
    // console.log(title, content, category);
    const slug = title.split(" ").join("-").toLowerCase().replace("/[^a-zA-Z0-9]/g", "-");

    try {
        const imageFilePath = req?.file?.path;
        const imageUrl = await uploadOnCloudinary(imageFilePath);
        if (!imageUrl) {
            return next(new AppError(500, "Error uploading image"));
        }

        const post = await Post.create({
            title,
            content,
            userId: req.user._id,
            slug,
            category,
            image: imageUrl,
        });

        return res.status(201).json(new ApiResponse(201, "Post created successfully", post));
    } catch (error) {
        if (error.name === "ValidationError") {
            error.message = "Invalid input";
            error.statusCode = 400;
        }
        if (error.name === "MongoServerError") {
            error.message = "Post already exists. Please use a different title";
            error.statusCode = 409;
        }
        next(new AppError(error.statusCode, error.message));
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json(new ApiResponse(200, "Post deleted successfully", post));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};
