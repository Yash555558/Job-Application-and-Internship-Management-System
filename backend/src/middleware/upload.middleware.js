import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create temporary uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for temporary local file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
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
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
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
        // Upload PDF to Cloudinary with professional configuration
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "resumes",
          resource_type: "image",   // MUST use image for PDF preview
          format: "pdf",          // MUST specify PDF format
          use_filename: true,
          unique_filename: true,
          access_mode: "public",   // Ensure public access
          invalidate: true,        // Invalidate CDN cache
          overwrite: false,        // Don't overwrite existing files
          discard_original_filename: false // Keep original filename info
        });
        
        // Explicitly make the uploaded file public
        await cloudinary.api.update(result.public_id, {
          access_mode: "public",
          resource_type: "image"
        });
        
        // Mandatory verification
        console.log("Cloudinary upload result:", {
          resource_type: result.resource_type,  // MUST log "image"
          public_id: result.public_id,
          secure_url: result.secure_url,
          format: result.format
        });
        
        // Clean up temporary file
        fs.unlinkSync(req.file.path);
        
        // Store the Cloudinary info for database storage
        req.file.cloudinary = {
          publicId: result.public_id,
          secureUrl: result.secure_url
        };
        
        next();
      } catch (error) {
        // Clean up temporary file on error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Failed to upload resume to Cloudinary' });
      }
    });
  };
};