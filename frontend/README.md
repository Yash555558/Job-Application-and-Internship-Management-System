# Job Portal Frontend

A modern, responsive job portal frontend built with React, Vite, and Tailwind CSS. This application provides a complete job search and application platform with both user and admin interfaces.

## Features

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

## Tech Stack

- **Frontend Framework**: React 18+ with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **State Management**: Context API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:5000/api`)

## Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── JobApplicationModal.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── JobManagement.jsx
│   └── ApplicationManagement.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── JobsPage.jsx
│   ├── Dashboard.jsx
│   ├── ApplicationsPage.jsx
│   └── AdminDashboard.jsx
├── contexts/           # React Context providers
│   └── AuthContext.jsx
├── services/           # API service utilities
│   └── api.js
├── utils/              # Utility functions
│   └── apiUtils.js
├── hooks/              # Custom React hooks
│   └── useApi.js
├── styles/             # Global styles
└── App.jsx             # Main application component
```

## API Endpoints Used

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

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

## Responsive Design

The application is fully responsive and works on all device sizes:
- Mobile-first approach with progressive enhancement
- Flexible grid layouts using Tailwind CSS
- Touch-friendly navigation and controls
- Optimized images and media queries

## Security Features

- JWT-based authentication
- Protected routes and components
- Secure API communication
- Input validation and sanitization

## Performance Optimizations

- Code splitting and lazy loading
- Efficient state management
- Optimized bundle size
- Image optimization techniques

## Browser Compatibility

- Chrome (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Edge (latest versions)

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.