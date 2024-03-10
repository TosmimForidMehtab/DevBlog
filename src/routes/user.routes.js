import express from "express";
import { createUser, deleteUser, getAllUsers, signIn, getUser, googleAuth, updateUser, signOut, sendOtp, verifyOtp } from "../controllers/user.controller.js";
import { validateCreateUser, validateSignIn, validateUserId, verifyToken, vlaidateGetUser, validateUpdateUser, verifyAdmin } from "../middlewares/user.middleware.js";
const router = express.Router();

router.route("/").post(validateCreateUser, createUser).get(verifyToken, verifyAdmin, getAllUsers);
router.route("/signin").post(validateSignIn, signIn);
router.post("/google", googleAuth);
router.put("/:id", validateUserId, validateUpdateUser, verifyToken, updateUser);
router.delete("/:id", validateUserId, verifyToken, deleteUser);
router.get("/:id", vlaidateGetUser, getUser);
router.post("/signout", signOut);

router.post("/send-otp", verifyToken, sendOtp);
router.post("/verify-otp", verifyToken, verifyOtp);
export default router;
