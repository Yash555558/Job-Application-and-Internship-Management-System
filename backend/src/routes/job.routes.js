import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  adminGetAllJobs
} from "../controllers/job.controller.js";
import { seedJobs } from "../controllers/seed.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

const router = express.Router();

/* Public routes */
router.get("/", getJobs);
router.get("/:id", getJobById);

/* Admin routes */
router.get("/admin/all", authMiddleware, adminOnly, adminGetAllJobs);
router.post("/", authMiddleware, adminOnly, createJob);
router.post("/seed", authMiddleware, adminOnly, seedJobs);
router.put("/:id", authMiddleware, adminOnly, updateJob);
router.delete("/:id", authMiddleware, adminOnly, deleteJob);

export default router;