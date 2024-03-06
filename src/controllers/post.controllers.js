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
        let imageUrl;
        if (imageFilePath) {
            imageUrl = await uploadOnCloudinary(imageFilePath);
            if (!imageUrl) {
                return next(new AppError(500, "Error uploading image"));
            }
        }
        const post = await Post.create({
            title,
            content,
            userId: req.user._id,
            slug,
            category,
        });

        if (imageUrl) {
            post.image = imageUrl;
            await post.save();
        }

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
        const { id } = req.params;
        if (!id) {
            return next(new AppError(400, "Post id is required"));
        }
        const post = await Post.findByIdAndDelete(id);
        res.status(200).json(new ApiResponse(200, "Post deleted successfully", post));
    } catch (error) {
        if (error.name === "CastError") {
            error.message = "Post not found";
            error.statusCode = 404;
        }
        if (error.name === "ValidationError") {
            error.message = "Invalid input";
            error.statusCode = 400;
        }
        next(new AppError(error.statusCode, error.message));
    }
};

export const getPosts = async (req, res, next) => {
    let page = parseInt(req.query.startIndex) < 0 ? 0 : parseInt(req.query.startIndex);
    const startIndex = page || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    try {
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && req.query.category !== "all" && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [{ title: { $regex: req.query.searchTerm, $options: "i" } }, { content: { $regex: req.query.searchTerm, $options: "i" } }],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        if (!posts) {
            return next(new AppError(500, "Error fetching posts"));
        }

        if (posts.length === 0) {
            return next(new AppError(404, "Posts not found"));
        }

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const lastMonthsPosts = await Post.countDocuments({
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
                $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            },
        });

        return res.status(200).json(new ApiResponse(200, "Posts fetched successfully", { posts, totalPosts, lastMonthsPosts }));
    } catch (error) {
        next(new AppError(error.statusCode, error.message));
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const slug = req.body.title.split(" ").join("-").toLowerCase().replace("/[^a-zA-Z0-9]/g", "-");
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                    slug: slug,
                },
            },
            { new: true }
        );

        if (!updatedPost) {
            return next(new AppError(404, "Post update failed"));
        }

        return res.status(200).json(new ApiResponse(200, "Post updated successfully", updatedPost));
    } catch (error) {
        if (error.name === "CastError") {
            error.message = "Post not found";
            error.statusCode = 404;
        }
        if (error.name === "ValidationError") {
            error.message = "Invalid input";
            error.statusCode = 400;
        }
        next(new AppError(error.statusCode, error.message));
    }
};
