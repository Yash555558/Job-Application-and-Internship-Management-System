# CareerFlow - Job Application & Internship Management System

A comprehensive full-stack job application and internship management platform built with the MERN stack. This system demonstrates modern hiring workflows with role-based dashboards, real-time application tracking, and administrative oversight capabilities.

## 🎯 Project Overview

CareerFlow is an enterprise-grade job management system that enables:
- **Applicants** to search, apply, and track job/internship applications
- **Administrators** to manage job postings, review applications, and oversee hiring workflows
- **Real-time status tracking** through the complete application lifecycle
- **Advanced analytics** and reporting for data-driven hiring decisions

## 🚀 Core Features

### 👤 Applicant (User) Features
- **🔐 Secure Authentication**: JWT-based signup and login system
- **🔍 Advanced Job Search**: Browse and filter job/internship listings by type, location, role, and keywords
- **📄 Complete Application Flow**: Apply with name, email, resume upload, and cover notes
- **📊 Real-time Application Tracking**: Monitor application status through Applied → Shortlisted → Selected → Rejected
- **📱 Responsive Dashboard**: Mobile-friendly interface for application management
- **🖼️ Profile Management**: Update personal information and upload profile pictures
- **🔒 Duplicate Prevention**: Intelligent system to prevent multiple applications for same position

### 🛠 Administrator Features
- **💼 Job Management**: Create, edit, delete, and manage job/internship postings
- **📋 Application Review**: Comprehensive application management with filtering capabilities
- **📈 Analytics Dashboard**: Real-time statistics and trends visualization
- **📊 Advanced Filtering**: Filter applications by job role, status, date range, and more
- **📤 CSV Export**: Export application data for external reporting and analysis
- **👥 User Management**: Administer user accounts and role assignments
- **📧 Email Notifications**: Automated status change notifications to applicants
- **🕒 Status History**: Complete audit trail of all application status changes

### 🎨 User Experience Enhancements
- **⚡ Performance Optimized**: Debounced search inputs and efficient pagination
- **🎨 Modern UI/UX**: Tailwind CSS styling with responsive design
- **🔔 Toast Notifications**: User-friendly feedback system
- **🛡 Protected Routes**: Role-based access control throughout the application
- **📱 Mobile Responsive**: Seamless experience across all device sizes

## 🛠️ Technology Stack

### Frontend Technologies
- **⚛️ React 19+**: Modern component-based architecture with Hooks
- **🚀 Vite**: Lightning-fast build tool and development server
- **🎨 Tailwind CSS**: Utility-first CSS framework for responsive design
- **🧭 React Router DOM**: Declarative routing for single-page applications
- **📡 Axios**: Promise-based HTTP client for API communication
- **🔥 React Hot Toast**: Beautiful toast notifications for user feedback
- **🔄 Context API**: State management for authentication and global data
- **📱 Responsive Design**: Mobile-first approach with progressive enhancement

### Backend Technologies
- **🟢 Node.js**: JavaScript runtime for server-side development
- **⚡ Express.js**: Minimalist web framework for RESTful APIs
- **🍃 MongoDB**: NoSQL database with flexible document structure
- **🦴 Mongoose ODM**: Elegant MongoDB object modeling for Node.js
- **🔐 JWT Authentication**: Secure token-based user authentication
- **☁️ Cloudinary**: Cloud-based image and media management
- **📧 Nodemailer**: Email sending capabilities for notifications
- **📁 Multer**: Middleware for handling multipart/form-data
- **⚙️ Dotenv**: Environment variable management
- **🛡 CORS**: Cross-origin resource sharing configuration

## 📁 Project Architecture

```
careerflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js         # MongoDB connection setup
│   │   │   └── env.js        # Environment configuration
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Authentication logic
│   │   │   ├── job.controller.js      # Job management logic
│   │   │   └── application.controller.js # Application processing
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT authentication
│   │   │   ├── role.middleware.js     # Role-based access control
│   │   │   └── upload.middleware.js   # File upload handling
│   │   ├── models/
│   │   │   ├── User.js       # User schema and model
│   │   │   ├── Job.js        # Job schema and model
│   │   │   └── Application.js # Application schema and model
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # Authentication routes
│   │   │   ├── job.routes.js          # Job management routes
│   │   │   └── application.routes.js  # Application routes
│   │   ├── utils/
│   │   │   ├── generateToken.js       # JWT token generation
│   │   │   └── sendEmail.js           # Email notification service
│   │   └── server.js         # Main server entry point
│   ├── .env                  # Backend environment variables
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   │   └── favicon.ico       # Application favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard.jsx # Admin analytics visualization
│   │   │   ├── ApplicationManagement.jsx # Admin application interface
│   │   │   ├── AvatarUpload.jsx      # Profile picture management
│   │   │   ├── ChangePassword.jsx    # Password update component
│   │   │   ├── Footer.jsx            # Site footer component
│   │   │   ├── JobApplicationModal.jsx # Job application form
│   │   │   ├── JobManagement.jsx     # Admin job management
│   │   │   ├── JobsFilterBar.jsx     # Job search filters
│   │   │   ├── Navbar.jsx            # Navigation component
│   │   │   ├── ToastProvider.jsx     # Notification system
│   │   │   └── UserManagement.jsx    # Admin user management
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       # Authentication state management
│   │   ├── hooks/
│   │   │   └── useDebounce.js        # Custom debounce hook
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx    # Admin dashboard
│   │   │   ├── ApplicationsPage.jsx  # User applications view
│   │   │   ├── Dashboard.jsx         # User dashboard
│   │   │   ├── HomePage.jsx          # Landing page
│   │   │   ├── JobDetailsPage.jsx    # Individual job view
│   │   │   ├── JobsPage.jsx          # Job listings page
│   │   │   ├── LoginPage.jsx         # Authentication login
│   │   │   ├── Profile.jsx           # User profile management
│   │   │   └── SignupPage.jsx        # User registration
│   │   ├── services/
│   │   │   └── api.js                # Axios API configuration
│   │   ├── utils/
│   │   │   └── formatDate.js         # Date formatting utilities
│   │   ├── App.jsx           # Main application component
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Application entry point
│   ├── .env                  # Frontend environment variables
│   ├── index.html            # HTML template
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
└── README.md                 # Project documentation (this file)
```

## 🚀 Quick Start Guide

### 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account)
- **npm** or **yarn** package manager
- **Git** for version control

### ⚙️ Backend Configuration

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables** by creating a `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
MONGODB_URI=mongodb://localhost:27017/careerflow
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careerflow

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Client Configuration
CLIENT_URL=http://localhost:5173

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=noreply@careerflow.com
```

4. **Start the development server**:
```bash
npm run dev
```

✅ Backend server will be available at `http://localhost:5000`

### 🖥️ Frontend Configuration

1. **Navigate to frontend directory** (in a new terminal):
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables** by creating a `.env` file:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Development Settings
VITE_APP_NAME=CareerFlow
VITE_APP_DESCRIPTION=Job Application & Internship Management System
```

4. **Start the development server**:
```bash
npm run dev
```

✅ Frontend will be available at `http://localhost:5173`

### 🧪 Test the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Create a new account or login as an existing user
3. Explore the job listings and application features
4. Access admin features by creating an admin account or assigning admin role

### 📦 Production Build

**Frontend Build**:
```bash
cd frontend
npm run build
```

**Backend Production**:
```bash
cd backend
npm start
```

## 🔐 Environment Configuration

### Backend Environment Variables (.env)

```env
# 🔧 Server Configuration
PORT=5000
NODE_ENV=development

# 🗄️ Database Connection
MONGODB_URI=mongodb://localhost:27017/careerflow

# 🔐 Authentication Security
JWT_SECRET=your_very_long_and_secure_secret_key_here_min_32_characters

# 🌐 Client Integration
CLIENT_URL=http://localhost:5173

# ☁️ Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 📧 Email Notification Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=noreply@careerflow.com
EMAIL_SECURE=false
```

### Frontend Environment Variables (.env)

```env
# 🌐 API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# 🏷️ Application Metadata
VITE_APP_NAME=CareerFlow
VITE_APP_DESCRIPTION=Job Application & Internship Management System
VITE_APP_VERSION=1.0.0

# 🎨 Theme Configuration
VITE_THEME_PRIMARY=#3B82F6
VITE_THEME_SECONDARY=#10B981
```

## 🧪 Comprehensive API Documentation

### 🔐 Authentication Endpoints

#### `POST /api/auth/signup`
**Description**: Register a new user account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response**: JWT token and user data

#### `POST /api/auth/login`
**Description**: Authenticate user login
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response**: JWT token and user profile

#### `GET /api/auth/profile` *(Protected)*
**Description**: Get authenticated user profile
**Headers**: `Authorization: Bearer <token>`
**Response**: User profile information

#### `PUT /api/auth/profile` *(Protected)*
**Description**: Update user profile information
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+1234567890"
}
```

#### `POST /api/auth/upload-avatar` *(Protected)*
**Description**: Upload user profile picture
**Content-Type**: `multipart/form-data`
**Body**: Form data with `avatar` file field

### 💼 Job Management Endpoints

#### `GET /api/jobs`
**Description**: Get all active jobs with optional filtering
**Query Parameters**:
- `search`: Search term for job title/description
- `type`: Filter by job type (Job/Internship)
- `location`: Filter by location
- `page`: Page number for pagination
- `limit`: Items per page

#### `GET /api/jobs/:id`
**Description**: Get specific job details by ID

#### `GET /api/jobs/admin/all` *(Admin Only)*
**Description**: Get all jobs (including inactive) for admin management

#### `POST /api/jobs` *(Admin Only)*
**Description**: Create new job posting
```json
{
  "title": "Software Engineer",
  "description": "Join our development team",
  "skills": ["JavaScript", "React", "Node.js"],
  "type": "Job",
  "location": "Remote",
  "salary": "$80,000 - $120,000",
  "isActive": true
}
```

#### `PUT /api/jobs/:id` *(Admin Only)*
**Description**: Update existing job posting

#### `DELETE /api/jobs/:id` *(Admin Only)*
**Description**: Delete job posting

### 📋 Application Management Endpoints

#### `POST /api/applications` *(Protected)*
**Description**: Submit job application
```json
{
  "jobId": "job_object_id",
  "resumeLink": "https://example.com/resume.pdf",
  "coverNote": "I'm excited to apply for this position..."
}
```

#### `GET /api/applications/me` *(Protected)*
**Description**: Get authenticated user's applications
**Query Parameters**:
- `status`: Filter by application status
- `sortBy`: Sort field (appliedAt, updatedAt)
- `order`: Sort order (asc/desc)

#### `GET /api/applications` *(Admin Only)*
**Description**: Get all applications with advanced filtering
**Query Parameters**:
- `search`: Search by applicant name/email
- `jobType`: Filter by job type
- `status`: Filter by application status
- `dateFrom`: Start date filter
- `dateTo`: End date filter
- `page`: Page number
- `limit`: Items per page

#### `PUT /api/applications/:id/status` *(Admin Only)*
**Description**: Update application status
```json
{
  "status": "Shortlisted",
  "feedback": "Your profile matches our requirements"
}
```

#### `GET /api/applications/analytics/jobs` *(Admin Only)*
**Description**: Get job-wise application analytics
**Response**: Statistics for each job including applicant counts and status distributions

#### `GET /api/applications/export/csv` *(Admin Only)*
**Description**: Export applications data as CSV
**Query Parameters**:
- `format`: Export format (csv)
- `filters`: Applied filters for export

### 👥 User Management Endpoints *(Admin Only)*

#### `GET /api/auth/users`
**Description**: Get all users with pagination
**Query Parameters**:
- `search`: Search by name or email
- `role`: Filter by user role
- `page`: Page number
- `limit`: Items per page

#### `GET /api/auth/users/count`
**Description**: Get total user count

#### `PUT /api/auth/users/:id/role`
**Description**: Update user role
```json
{
  "role": "admin"
}
```

### 📊 Response Format Standards

#### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

#### Pagination Response
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 📱 Responsive Design & Accessibility

### Device Compatibility
- **Mobile-first approach** with progressive enhancement
- **Flexible grid layouts** using Tailwind CSS utility classes
- **Touch-friendly navigation** and interactive elements
- **Optimized media queries** for all screen sizes
- **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)

### Accessibility Features
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Proper contrast ratios
- Focus indicators for interactive elements

## 🔒 Security Implementation

### Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin/User permissions)
- **Protected routes** with automatic redirection
- **Session management** with token expiration

### Data Protection
- **Input validation** and sanitization at multiple levels
- **Password hashing** using bcrypt with salt rounds
- **CORS configuration** for controlled cross-origin requests
- **Rate limiting** to prevent abuse
- **Secure API communication** with proper headers

### File Security
- **Cloudinary integration** for secure media storage
- **File type validation** for uploads
- **Size limitations** to prevent abuse
- **Secure file serving** with proper access controls

## 🚀 Deployment Guide

### Backend Deployment (Render)

1. **Prepare for deployment**:
```bash
# Test locally in production mode
NODE_ENV=production npm start
```

2. **Render Configuration**:
- Repository: Connect your GitHub repository
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: Add all required backend variables
- Health Check: `/api/health`

### Frontend Deployment (Vercel)

1. **Build for production**:
```bash
npm run build
```

2. **Vercel Configuration**:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: Add frontend configuration

3. **Domain Configuration**:
- Custom domain setup
- SSL certificate management
- Environment variable injection

### Database Deployment (MongoDB Atlas)

1. **Create cluster** on MongoDB Atlas
2. **Configure network access** and database users
3. **Update connection string** in backend environment
4. **Enable backups** and monitoring

## 🧪 Testing Strategy

### Frontend Testing
- Component unit testing with Jest
- Integration testing with React Testing Library
- End-to-end testing with Cypress
- Browser compatibility testing

### Backend Testing
- API endpoint testing with Postman/Newman
- Database integration testing
- Authentication flow validation
- Performance and load testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Job search and filtering
- [ ] Application submission
- [ ] Admin job management
- [ ] Application status updates
- [ ] Email notifications
- [ ] File uploads
- [ ] Mobile responsiveness

## 🤝 Contributing Guidelines

### Development Workflow
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create feature branch**: `git checkout -b feature/amazing-feature`
4. **Install dependencies**: `npm install` in both frontend and backend
5. **Develop** your feature with proper testing
6. **Commit** with conventional commit messages
7. **Push** to your fork: `git push origin feature/amazing-feature`
8. **Create Pull Request** with detailed description

### Code Standards
- **ESLint** configuration for code quality
- **Prettier** for code formatting
- **Conventional commits** for changelog generation
- **Component documentation** in JSDoc format

### Pull Request Requirements
- Pass all automated tests
- Include relevant documentation updates
- Follow existing code style and patterns
- Provide clear description of changes
- Reference related issues

## 📊 Performance Optimization

### Frontend Performance
- **Code splitting** for lazy-loaded components
- **Image optimization** with proper sizing and formats
- **Bundle analysis** to identify large dependencies
- **Caching strategies** for static assets
- **Minification** and compression

### Backend Performance
- **Database indexing** for frequently queried fields
- **Query optimization** and aggregation pipelines
- **Connection pooling** for database connections
- **Response caching** for static data
- **Load balancing** for high traffic scenarios

## 📈 Future Enhancements

### Planned Features
- **Real-time notifications** with WebSocket integration
- **Advanced analytics dashboard** with charts and graphs
- **Multi-language support** (i18n implementation)
- **Social login integration** (Google, LinkedIn)
- **Advanced search** with Elasticsearch
- **Mobile app** development (React Native)

### Scalability Improvements
- **Microservice architecture** decomposition
- **Containerization** with Docker
- **CI/CD pipeline** automation
- **Monitoring and logging** with centralized systems
- **Auto-scaling** infrastructure

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer Information

**Portfolio Project** - Job Application & Internship Management System

**Developer**: Yash Kumar
**Contact**: yash777881@gmail.com
**LinkedIn**: [linkedin.com/in/yash---kumar](https://www.linkedin.com/in/yash---kumar/)
**Phone**: +91 9548262709

## 💬 Support & Feedback

For support, feature requests, or bug reports:
- **GitHub Issues**: Open an issue in the repository
- **Email**: Contact the development team directly
- **Documentation**: Check the comprehensive guides above

---

<p align="center">
  <strong>Built with ❤️ using the MERN Stack</strong><br/>
  React • Node.js • Express.js • MongoDB • Tailwind CSS
</p>