import multer from "multer";

// Create upload middleware that initializes Cloudinary when first used
let uploadMiddleware = null;
let cloudinaryInitialized = false;

const initializeCloudinary = async () => {
  if (!cloudinaryInitialized) {
    // Import modules dynamically when needed
    const { CloudinaryStorage } = await import('multer-storage-cloudinary');
    const { v2: cloudinary } = await import('cloudinary');
    
    // Configure cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "resumes",
        resource_type: "raw",
        format: async () => "pdf"
      }
    });
    
    uploadMiddleware = multer({ storage });
    cloudinaryInitialized = true;
  }
  return uploadMiddleware;
};

// Export a middleware function that initializes Cloudinary on first use
export default () => {
  return async (req, res, next) => {
    if (!cloudinaryInitialized) {
      await initializeCloudinary();
    }
    return uploadMiddleware.single('resume')(req, res, next);
  };
};