import express from "express";
import { createUser, deleteUser, getAllUsers, signIn, getUser, googleAuth, updateUser, signOut } from "../controllers/user.controller.js";
import { validateCreateUser, validateSignIn, validateUserId, verifyToken, vlaidateGetUser, validateUpdateUser } from "../middlewares/user.middleware.js";
const router = express.Router();

router.route("/").post(validateCreateUser, createUser).get(getAllUsers);
router.route("/signin").post(validateSignIn, signIn);
router.post("/google", googleAuth);
router.put("/:id", validateUserId, validateUpdateUser, verifyToken, updateUser);
router.delete("/:id", validateUserId, verifyToken, deleteUser);
router.get("/user", vlaidateGetUser, getUser);
router.post("/signout", signOut);
export default router;
