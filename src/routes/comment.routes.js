import express from "express";
import { createComment, getComment } from "../controllers/comment.controllers.js";
import { createCommentValidation } from "../middlewares/comment.middlewares.js";
import { verifyToken } from "../middlewares/user.middleware.js";
const router = express.Router();

router.post("/", verifyToken, createCommentValidation, createComment);
router.get("/:id", verifyToken, getComment);
export default router;
