import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { sendStatusEmail } from "../utils/sendEmail.js";
import { Parser } from "json2csv";
import fs from "fs";
import path from "path";
import axios from "axios";

/**
 * @desc   Apply to a job
 * @route  POST /api/applications
 * @access User
 */
export const applyToJob = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { jobId, name, email, phone, coverNote, education, experience, skills } = req.body;

    // Validate required fields
    if (!jobId || !name || !email || !phone || !education || !experience) {
      return res.status(400).json({ message: "All required fields (jobId, name, email, phone, education, experience) must be provided" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    // Validate required fields
    if (!name || !email || !phone || !education || !experience) {
      return res.status(400).json({ message: "All required fields (name, email, phone, education, experience) must be provided" });
    }

    const resumeLink = req.file.cloudinary.secureUrl;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not available" });
    }

    const application = await Application.create({
      userId: req.user.id,
      jobId,
      resumeLink,
      name,
      email,
      phone,
      education,
      experience,
      skills,
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
    const { status, jobId, search, jobType, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    let query = {};

    // Status filter
    if (status) query.status = status;
    
    // Job ID filter
    if (jobId) query.jobId = jobId;
    
    // Search filter (across name, email, and skills)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Job type filter (requires joining with jobs collection)
    if (jobType) {
      const jobsOfType = await Job.find({ type: jobType }).select('_id');
      const jobIds = jobsOfType.map(job => job._id);
      query.jobId = { $in: jobIds };
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.appliedAt = {};
      if (dateFrom) query.appliedAt.$gte = new Date(dateFrom);
      if (dateTo) query.appliedAt.$lte = new Date(dateTo);
    }

    // Convert to numbers with defaults
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit))); // Cap at 100 per page max

    // Get total count for pagination metadata
    const totalCount = await Application.countDocuments(query);

    // Get paginated results
    const applications = await Application.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("userId", "name email avatar")
      .populate("jobId", "title type location")
      .sort({ appliedAt: -1 });

    // Send response with pagination metadata
    res.json({
      applications,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalApplications: totalCount,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1,
        limit: limitNum
      }
    });
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
      applicantName: app.name,
      email: app.email,
      phone: app.phone,
      education: app.education,
      experience: app.experience,
      skills: app.skills,
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
    
    // Debug logging
    console.log("=== DEBUG INFO ===");
    console.log("Application object:", application);
    console.log("Application resumeLink:", application?.resumeLink);
    console.log("==================");
    
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
    
    // Explicit guard for resume URL
    if (!application.resumeLink) {
      console.log("Resume URL not found in application");
      return res.status(404).json({ message: "Resume not found" });
    }
    
    const resumeUrl = application.resumeLink;
    console.log("Resume URL:", resumeUrl);
    
    // Handle Cloudinary URL directly for public access
    try {
      console.log("Processing Cloudinary resume URL for direct access");
      
      // For raw files stored with anonymous access, we can serve them directly
      // Cloudinary URLs for raw files are publicly accessible when properly configured
      
      // Validate that this is a Cloudinary URL
      if (!resumeUrl.includes('cloudinary.com')) {
        console.log("Invalid Cloudinary URL");
        return res.status(400).json({ message: "Invalid resume storage URL" });
      }
      
      // For raw files with anonymous access, redirect to the direct Cloudinary URL
      console.log("Redirecting to Cloudinary URL:", resumeUrl);
      
      // Set appropriate headers for PDF download
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      });
      
      // Redirect to the Cloudinary URL
      return res.redirect(resumeUrl);
      
      console.log("Authenticated download URL:", downloadUrl);
      
      // Fetch the file using the authenticated URL
      const response = await axios.get(downloadUrl, { 
        responseType: 'arraybuffer',
        timeout: 15000 // 15 second timeout
      });
      
      console.log("Download response status:", response.status);
      console.log("Download response size:", response.data?.length || 0);
      
      console.log("Cloudinary response status:", response.status);
      console.log("Cloudinary response headers:", response.headers);
      console.log("Response data length:", response.data?.length || 0);
      
      // Validate response
      if (!response.data) {
        console.error("Empty response from Cloudinary");
        return res.status(500).json({ message: "Empty resume data received from storage" });
      }
      
      // Set appropriate headers for download
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Content-Length': response.data.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      console.log("Sending resume data, size:", response.data.length, "bytes");
      
      // Send the PDF data
      res.send(Buffer.from(response.data));
      
    } catch (fetchError) {
      console.error("=== CLOUDINARY FETCH ERROR ===");
      console.error("Error type:", fetchError.constructor.name);
      console.error("Error message:", fetchError.message);
      console.error("Error code:", fetchError.code);
      console.error("Response status:", fetchError.response?.status);
      console.error("Response data:", fetchError.response?.data);
      console.error("===============================");
      
      // More specific error messages
      if (fetchError.response) {
        if (fetchError.response.status === 404) {
          return res.status(404).json({ message: "Resume file not found in storage" });
        } else if (fetchError.response.status === 401) {
          return res.status(500).json({ message: "Unauthorized access to resume storage" });
        } else if (fetchError.response.status === 403) {
          return res.status(500).json({ message: "Access forbidden to resume storage" });
        }
      } else if (fetchError.code === 'ECONNABORTED') {
        return res.status(500).json({ message: "Timeout while fetching resume from storage" });
      } else if (fetchError.code === 'ENOTFOUND') {
        return res.status(500).json({ message: "Storage service not reachable" });
      }
      
      return res.status(500).json({ message: "Failed to fetch resume from storage" });
    }
    
  } catch (error) {
    console.error("Resume download error:", error);
    res.status(500).json({ message: "Failed to download resume" });
  }
};