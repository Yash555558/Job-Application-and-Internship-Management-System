import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { sendStatusEmail } from "../utils/sendEmail.js";
import { Parser } from "json2csv";
import fs from "fs";
import path from "path";

/**
 * @desc   Apply to a job
 * @route  POST /api/applications
 * @access User
 */
export const applyToJob = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { jobId, coverNote } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumeLink = req.file.path;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not available" });
    }

    const application = await Application.create({
      userId: req.user.id,
      jobId,
      resumeLink,
      coverNote,
      statusHistory: [{ status: "Applied", changedAt: new Date() }]
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("APPLY ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc   User dashboard applications
 * @route  GET /api/applications/me
 * @access User
 */
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate("jobId", "title type location")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Admin: get all applications
 * @route  GET /api/applications
 * @access Admin
 */
export const getAllApplications = async (req, res) => {
  try {
    const { status, jobId, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (jobId) query.jobId = jobId;

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .skip(skip)
      .limit(Number(limit))
      .populate("userId", "name email")
      .populate("jobId", "title type")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Admin: update application status
 * @route  PUT /api/applications/:id/status
 * @access Admin
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("userId", "email")
      .populate("jobId", "title");
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date()
    });

    await application.save();
    
    // Send email notification
    await sendStatusEmail(
      application.userId.email,
      application.jobId.title,
      status
    );
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Admin analytics: applications per job
 * @route  GET /api/applications/analytics/jobs
 * @access Admin
 */
export const applicationsPerJob = async (req, res) => {
  try {
    const analytics = await Application.aggregate([
      {
        $group: {
          _id: "$jobId",
          totalApplications: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },
      {
        $project: {
          jobTitle: "$job.title",
          totalApplications: 1
        }
      }
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportApplicationsCSV = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("jobId", "title");

    const data = applications.map(app => ({
      applicantName: app.userId.name,
      email: app.userId.email,
      jobTitle: app.jobId.title,
      status: app.status,
      appliedAt: app.appliedAt
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("applications.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Download resume file directly from server
 * @route  GET /api/applications/:id/resume
 * @access User
 */
export const downloadResume = async (req, res) => {
  try {
    console.log("Download resume request received for ID:", req.params.id);
    console.log("User ID:", req.user.id);
    console.log("User role:", req.user.role);
    
    const { id } = req.params;
    
    // Find the application
    const application = await Application.findById(id)
      .populate("userId", "name")
      .populate("jobId", "title");
    
    if (!application) {
      console.log("Application not found");
      return res.status(404).json({ message: "Application not found" });
    }
    
    console.log("Application found:", application._id);
    console.log("Application user ID:", application.userId._id.toString());
    
    // Check if user owns this application (unless admin)
    if (req.user.role !== 'admin' && application.userId._id.toString() !== req.user.id) {
      console.log("Access denied - User ID mismatch");
      console.log("Request user ID:", req.user.id);
      console.log("Application user ID:", application.userId._id.toString());
      return res.status(403).json({ message: "Access denied" });
    }
    
    const resumePath = application.resumeLink;
    
    if (!resumePath) {
      console.log("Resume path not found");
      return res.status(404).json({ message: "Resume not found" });
    }
    
    console.log("Resume path:", resumePath);
    
    // Construct full file path
    const fullPath = path.join(process.cwd(), resumePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log("Resume file not found at path:", fullPath);
      return res.status(404).json({ message: "Resume file not found" });
    }
    
    // Get file stats
    const fileStats = fs.statSync(fullPath);
    
    // Extract filename from path
    const fileName = path.basename(resumePath);
    
    console.log("Filename extracted:", fileName);
    
    // Set headers for direct download
    const isPdfFile = fileName.toLowerCase().endsWith('.pdf');
    const contentType = isPdfFile ? 'application/pdf' : 'application/octet-stream';
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileStats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    console.log("Headers set - Content-Disposition:", `attachment; filename="${fileName}"`);
    console.log("File size:", fileStats.size, "bytes");
    
    // Stream the file from local storage
    console.log("Streaming file from local storage...");
    const fileStream = fs.createReadStream(fullPath);
    
    fileStream.on('error', (error) => {
      console.error("File stream error:", error);
      return res.status(500).json({ message: "Failed to stream resume file" });
    });
    
    fileStream.pipe(res);
    
  } catch (error) {
    console.error("Resume download error:", error);
    res.status(500).json({ message: "Failed to download resume" });
  }
};