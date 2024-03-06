import express from "express";
import { createComment, deleteComment, editComment, getAllComments, getComment, likeComment } from "../controllers/comment.controllers.js";
import { createCommentValidation } from "../middlewares/comment.middlewares.js";
import { verifyToken, verifyAdmin } from "../middlewares/user.middleware.js";
const router = express.Router();

router.post("/", verifyToken, createCommentValidation, createComment);
router.get("/:id", verifyToken, getComment);
router.put("/like/:id", verifyToken, likeComment);
router.put("/edit/:id", verifyToken, editComment);
router.delete("/:id", verifyToken, deleteComment);
router.get("/", verifyToken, verifyAdmin, getAllComments);
export default router;
