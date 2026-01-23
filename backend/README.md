# Job Application Backend - Phase 1: Foundation + Auth

## ✅ Completed Features

- **Project Structure**: Complete folder organization
- **MongoDB Connection**: Configured with Mongoose
- **User Model**: With roles (user/admin)
- **Authentication**: Signup/Login with JWT
- **Middleware**: JWT protection and role-based access control
- **Environment Configuration**: Ready for deployment

## 📁 Project Structure

```
backend/
│
├── src/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── env.js         # Environment variables
│   │
│   ├── models/
│   │   └── User.js        # User schema with roles
│   │
│   ├── controllers/
│   │   └── auth.controller.js  # Authentication logic
│   │
│   ├── routes/
│   │   └── auth.routes.js      # Auth endpoints
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── role.middleware.js  # Admin access control
│   │
│   ├── utils/
│   │   └── generateToken.js    # JWT token generation
│   │
│   └── server.js          # Express app entry point
│
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Update `.env` file:
```env
PORT=5000
MONGO_URI=your_actual_mongodb_atlas_uri_here
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

### 3. Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

## 🛠️ Middleware

- **authMiddleware**: Protects routes with JWT verification
- **adminOnly**: Restricts access to admin users only

## 📦 Dependencies Installed

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token handling
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables
- `nodemon` (dev): Auto-restart during development

## 🔧 Next Steps

This foundation is ready to be extended with:
- Job listings management
- Application tracking
- Analytics dashboard
- CSV export functionality
- Admin panel features

## ⚠️ Important Notes

1. Replace `your_mongodb_atlas_uri` in `.env` with your actual MongoDB connection string
2. Change `JWT_SECRET` to a strong secret key in production
3. Update `CLIENT_URL` to match your frontend URL
4. The server will run on `http://localhost:5000` by default

All modules have been tested and import correctly. The backend is ready for development!