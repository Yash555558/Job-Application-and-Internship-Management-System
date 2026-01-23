import Job from "../models/Job.js";
import Application from "../models/Application.js";

/**
 * @desc   Get all jobs (public)
 * @route  GET /api/jobs
 * @access Public
 */
export const getJobs = async (req, res) => {
  try {
    const { type, location, search, page = 1, limit = 6 } = req.query;

    let query = { isActive: true };

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = new RegExp(location, "i");
    }

    if (search) {
      query.title = new RegExp(search, "i");
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get single job by ID
 * @route  GET /api/jobs/:id
 * @access Public
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Create new job
 * @route  POST /api/jobs
 * @access Admin
 */
export const createJob = async (req, res) => {
  try {
    const { title, description, skills, type, location } = req.body;

    const job = await Job.create({
      title,
      description,
      skills,
      type,
      location
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Update job
 * @route  PUT /api/jobs/:id
 * @access Admin
 */
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Delete job
 * @route  DELETE /api/jobs/:id
 * @access Admin
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Admin: get all jobs (including inactive)
 * @route  GET /api/jobs/admin/all
 * @access Admin
 */
export const adminGetAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const jobs = await Job.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};