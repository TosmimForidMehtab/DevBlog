import { Router } from "express";
import { verifyAdmin, verifyToken } from "../middlewares/user.middleware.js";
import { createPost, deletePost } from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.post("/", verifyToken, verifyAdmin, upload.single("image"), createPost);
router.delete("/:id", deletePost);
export default router;
