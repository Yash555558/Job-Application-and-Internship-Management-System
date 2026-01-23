import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Custom middleware for resume upload
const uploadMiddleware = multer({ dest: 'uploads/' });

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
        // Upload PDF to Cloudinary with proper configuration for a real-world application
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "resumes",
          resource_type: "raw",  // Store as raw file to preserve PDF format
          use_filename: true,
          unique_filename: true,
          public_id: `${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, '')}`,
          type: "upload",
          access_mode: "public",
          // Additional settings for production use
          overwrite: false,
          invalidate: false
        });
        
        // Log for verification
        console.log("Cloudinary upload result:", {
          access_mode: result.access_mode,
          secure_url: result.secure_url,
          resource_type: result.resource_type,
          format: result.format
        });
        
        // Clean up temporary file
        fs.unlinkSync(req.file.path);
        
        // Attach Cloudinary URL to request
        req.file.path = result.secure_url;
        
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