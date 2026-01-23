import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";
import {
  applyToJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  applicationsPerJob,
  exportApplicationsCSV
} from "../controllers/application.controller.js";

const router = express.Router();

/* User */
router.post(
  "/",
  authMiddleware,
  async (req, res, next) => {
    // Dynamically import and use upload middleware
    const uploadModule = await import("../middleware/upload.middleware.js");
    const uploadMiddleware = uploadModule.default();
    return uploadMiddleware(req, res, next);
  },
  applyToJob
);
router.get("/me", authMiddleware, getMyApplications);

/* Admin */
router.get("/", authMiddleware, adminOnly, getAllApplications);
router.put("/:id/status", authMiddleware, adminOnly, updateApplicationStatus);
router.get("/analytics/jobs", authMiddleware, adminOnly, applicationsPerJob);
router.get("/export/csv", authMiddleware, adminOnly, exportApplicationsCSV);

export default router;