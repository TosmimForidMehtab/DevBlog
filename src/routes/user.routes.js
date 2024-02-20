import express from "express";
import { createUser, deleteUser, getAllUsers, signIn, getUser, googleAuth } from "../controllers/user.controller.js";
import { validateCreateUser, validateSignIn } from "../middlewares/user.middleware.js";
const router = express.Router();

router.route("/").post(validateCreateUser, createUser).get(getAllUsers);
router.route("/signin").post(validateSignIn, signIn);
router.post("/google", googleAuth);

router.delete("/:id", deleteUser);
router.get("/user", getUser);
export default router;
