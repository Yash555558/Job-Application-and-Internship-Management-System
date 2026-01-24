import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load environment variables first
dotenv.config();
connectDB();

const app = express();

// Configure CORS to handle origin with or without trailing slash
const clientUrl = process.env.CLIENT_URL;
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Remove trailing slash from both URLs for comparison
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : '';
    const normalizedClientUrl = clientUrl ? clientUrl.replace(/\/$/, '') : '';
    
    // Check if the origin matches the allowed client URL
    if (normalizedOrigin === normalizedClientUrl || normalizedOrigin === clientUrl) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Import all routes
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Job Application API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);