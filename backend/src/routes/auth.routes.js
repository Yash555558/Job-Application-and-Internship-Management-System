import express from "express";
import { signup, login, getProfile, updateProfile, changePassword, uploadAvatar, getAllUsers, updateUserRole, getUserCount } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/upload-avatar", authMiddleware, async (req, res, next) => {
  const uploadMiddleware = (await import('../middleware/avatarUpload.middleware.js')).default();
  return uploadMiddleware(req, res, next);
}, uploadAvatar);

// Admin routes
router.get("/users", authMiddleware, adminOnly, getAllUsers);
router.get("/users/count", authMiddleware, adminOnly, getUserCount);
router.put("/users/:id/role", authMiddleware, adminOnly, updateUserRole);

export default router;