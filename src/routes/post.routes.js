import { Router } from "express";
import { verifyAdmin, verifyToken } from "../middlewares/user.middleware.js";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.js";
import { validatePostId, updatePostValidation } from "../middlewares/post.middleware.js";

const router = Router();

router.post("/", verifyToken, verifyAdmin, upload.single("image"), createPost);
router.get("/", getPosts);
router.delete("/:id", validatePostId, verifyToken, verifyAdmin, deletePost);
router.put("/:id", validatePostId, updatePostValidation, verifyToken, verifyAdmin, upload.single("image"), updatePost);
export default router;
