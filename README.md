# Job Portal Application

A comprehensive full-stack job portal application featuring a modern React frontend with Tailwind CSS and a robust Node.js/Express backend with MongoDB.

## 🚀 Features

### User Features
- **User Authentication**: Secure signup and login system
- **Job Search**: Browse and filter job listings by type, location, and keywords
- **Job Applications**: Apply to jobs with resume upload and cover letters
- **Application Tracking**: Monitor application status in real-time
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- **Job Management**: Create, edit, and delete job postings
- **Application Management**: Review and update application statuses
- **Analytics Dashboard**: View application statistics and trends
- **CSV Export**: Export application data for reporting
- **User Management**: Manage user accounts and permissions

### Bonus Features Implemented
- ✅ **Email Notification on Status Change**: Automatic email notifications when application status changes
- ✅ **Resume Upload using Cloudinary**: Secure resume file storage and retrieval
- ✅ **Pagination for Job Listings**: Efficient pagination for large job datasets
- ✅ **Admin Analytics (total applicants per job)**: Detailed analytics dashboard
- ✅ **Status Change History Log**: Complete history of application status changes
- ✅ **Export applications as CSV**: Export functionality for admin reporting

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19+ with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **State Management**: Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer (with Cloudinary integration)
- **Environment**: Dotenv
- **Validation**: Built-in validation

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/           # Database and environment configs
│   │   ├── controllers/      # API controllers
│   │   ├── middleware/       # Custom middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Main server file
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React Context providers
│   │   ├── services/         # API service utilities
│   │   ├── utils/            # Utility functions
│   │   ├── hooks/            # Custom React hooks
│   │   └── App.jsx           # Main application component
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLIENT_URL`: Frontend URL for CORS
- `CLOUDINARY_*`: Cloudinary credentials for file uploads
- `EMAIL_*`: Email service credentials for notifications

### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API base URL

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:id` - Get job by ID (public)
- `GET /api/jobs/admin/all` - Get all jobs (admin only)
- `POST /api/jobs` - Create job (admin only)
- `PUT /api/jobs/:id` - Update job (admin only)
- `DELETE /api/jobs/:id` - Delete job (admin only)

### Applications
- `POST /api/applications` - Apply to job (user only)
- `GET /api/applications/me` - Get user's applications (user only)
- `GET /api/applications` - Get all applications (admin only)
- `PUT /api/applications/:id/status` - Update application status (admin only)
- `GET /api/applications/analytics/jobs` - Get application analytics (admin only)
- `GET /api/applications/export/csv` - Export applications as CSV (admin only)

## 📱 Responsive Design

The application is fully responsive and works on all device sizes:
- Mobile-first approach with progressive enhancement
- Flexible grid layouts using Tailwind CSS
- Touch-friendly navigation and controls
- Optimized images and media queries

## 🔒 Security Features

- JWT-based authentication
- Protected routes and components
- Secure API communication
- Input validation and sanitization
- Password hashing with bcrypt
- CORS configured for security

## 🚀 Deployment

### Backend
- Deploy to platforms like Heroku, Railway, or AWS
- Ensure MongoDB connection is properly configured
- Set environment variables securely

### Frontend
- Build for production: `npm run build`
- Deploy static files to CDN or hosting service
- Configure proxy settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using React, Node.js, and MongoDB