import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    resumeLink: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    education: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      required: true
    },
    skills: {
      type: String
    },
    coverNote: {
      type: String
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
      default: "Applied"
    },
    statusHistory: [
      {
        status: String,
        changedAt: Date
      }
    ],
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

/* Prevent duplicate applications */
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);