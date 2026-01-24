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

// Custom middleware for avatar upload
const avatarUploadMiddleware = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    // Accept common image formats
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'), false);
    }
  }
});

export default () => {
  return async (req, res, next) => {
    // Handle file upload with multer first
    avatarUploadMiddleware.single('avatar')(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Avatar file size must be less than 2MB' });
          }
        }
        return res.status(400).json({ message: 'Avatar upload failed: ' + err.message });
      }
      
      // If no file was uploaded, continue without avatar
      if (!req.file) {
        return next();
      }
      
      try {
        // Upload image to Cloudinary with avatar-specific configuration
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" }, // Square crop focusing on face
            { quality: "auto", fetch_format: "auto" } // Auto optimize quality and format
          ],
          use_filename: true,
          unique_filename: true,
          access_mode: "public",
          invalidate: true,
          overwrite: false
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
        console.error('Cloudinary avatar upload error:', error);
        return res.status(500).json({ message: 'Failed to upload avatar to Cloudinary' });
      }
    });
  };
};