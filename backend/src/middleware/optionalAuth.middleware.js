import jwt from "jsonwebtoken";

const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // ✅ NORMALIZE USER OBJECT (convert JWT payload to consistent format)
      req.user = {
        _id: decoded.id,
        role: decoded.role
      };
    } catch (error) {
      // If token is invalid, continue without user info
      req.user = null;
    }
  } else {
    // No token provided
    req.user = null;
  }
  
  next();
};

export default optionalAuthMiddleware;