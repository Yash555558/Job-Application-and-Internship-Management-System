import Job from "../models/Job.js";

/**
 * @desc   Bulk create jobs for seeding
 * @route  POST /api/jobs/seed
 * @access Admin (temporary route for seeding)
 */
export const seedJobs = async (req, res) => {
  try {
    const jobs = req.body.jobs;
    
    if (!Array.isArray(jobs)) {
      return res.status(400).json({ message: "Jobs must be an array" });
    }

    // Validate each job
    for (const job of jobs) {
      if (!job.title || !job.description || !job.skills || !job.type || !job.location) {
        return res.status(400).json({ 
          message: `Missing required fields in job: ${job.title || 'Unknown'}` 
        });
      }
    }

    // Create all jobs
    const createdJobs = await Job.insertMany(jobs);

    res.status(201).json({
      message: `Successfully created ${createdJobs.length} jobs`,
      count: createdJobs.length
    });
  } catch (error) {
    console.error("Seed jobs error:", error);
    res.status(500).json({ message: error.message });
  }
};