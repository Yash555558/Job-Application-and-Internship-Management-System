import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { promisify } from "util";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Promisify the uploader
const uploadToCloudinary = promisify(cloudinary.uploader.upload);

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
      
      try {
        // Upload to Cloudinary with explicit image resource type for PDF preview
        const result = await uploadToCloudinary(req.file.path, {
          folder: "resumes",
          resource_type: "image",
          format: "pdf",
          use_filename: true,
          unique_filename: false
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