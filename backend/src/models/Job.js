import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    skills: {
      type: [String],
      required: true
    },
    type: {
      type: String,
      enum: ["Internship", "Job"],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);