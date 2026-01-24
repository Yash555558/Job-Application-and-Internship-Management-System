import express from "express";
import { signup, login, getProfile, updateProfile, changePassword } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;