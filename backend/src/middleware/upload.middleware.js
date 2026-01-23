import multer from "multer";
import fs from "fs";
import path from "path";

// Create resumes directory if it doesn't exist
const resumesDir = path.join(process.cwd(), 'resumes');
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}-${basename}${ext}`);
  }
});

// Custom middleware for resume upload
const uploadMiddleware = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default () => {
  return async (req, res, next) => {
    // Handle file upload with multer first
    uploadMiddleware.single('resume')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload failed' });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'Resume file is required' });
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        // Clean up temp file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Only PDF files are allowed' });
      }
      
      try {
        // File is already stored locally by multer diskStorage
        // req.file.path contains the full local file path
        
        // Log for verification
        console.log("Local file upload result:", {
          filename: req.file.filename,
          originalname: req.file.originalname,
          path: req.file.path,
          size: req.file.size
        });
        
        // Store the relative path for database storage
        req.file.path = `/resumes/${req.file.filename}`;
        
        next();
      } catch (error) {
        // Clean up file on error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        console.error('Local file upload error:', error);
        return res.status(500).json({ message: 'Failed to upload resume' });
      }
    });
  };
};