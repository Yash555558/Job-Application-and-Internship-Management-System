import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import JobManagement from '../components/JobManagement';
import ApplicationManagement from '../components/ApplicationManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalUsers: 0,
    pendingApplications: 0
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and other data
        const [jobsResponse, applicationsResponse] = await Promise.all([
          api.get('/jobs/admin/all'),
          api.get('/applications?page=1&limit=100') // Get first 100 for dashboard overview
        ]);

        setJobs(jobsResponse.data);
        setApplications(applicationsResponse.data.applications || applicationsResponse.data);

        // Calculate stats
        const appsData = applicationsResponse.data.applications || applicationsResponse.data;
        const totalAppsCount = applicationsResponse.data.pagination?.totalApplications || appsData.length;
        
        // Fetch user count
        const usersResponse = await api.get('/auth/users/count');
        
        setStats({
          totalJobs: jobsResponse.data.length,
          totalApplications: totalAppsCount,
          totalUsers: usersResponse.data.count,
          pendingApplications: appsData.filter(app => app.status === 'Applied').length
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage jobs, applications, and monitor platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Apps</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Job Management
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Application Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Jobs */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Jobs</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job._id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.location}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.type === 'Internship' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span className={`${
                          job.isActive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {applications.slice(0, 5).map(application => (
                    <div key={application._id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{application.jobId?.title}</h3>
                          <p className="text-sm text-gray-500">{application.userId?.name}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          application.status === 'Applied' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'Selected' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('jobs')}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="text-lg font-medium text-gray-900">Create Job</h3>
                      <p className="text-sm text-gray-500">Post a new job opening</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('applications')}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="text-lg font-medium text-gray-900">Review Apps</h3>
                      <p className="text-sm text-gray-500">Check pending applications</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-500">View platform statistics</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'jobs' && (
          <JobManagement />
        )}

        {activeTab === 'applications' && (
          <ApplicationManagement />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}
        
        {activeTab === 'users' && (
          <UserManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;