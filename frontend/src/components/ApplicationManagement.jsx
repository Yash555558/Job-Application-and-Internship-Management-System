import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    jobId: ''
  });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, filters]);

  const fetchData = async () => {
    try {
      const [appsResponse, jobsResponse] = await Promise.all([
        api.get('/applications'),
        api.get('/jobs/admin/all')
      ]);
      
      setApplications(appsResponse.data);
      setJobs(jobsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading data: ' + (error.response?.data?.message || 'Something went wrong'));
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.jobId) {
      filtered = filtered.filter(app => app.jobId._id === filters.jobId);
    }

    return filtered;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      // Update the application in the local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toast.error('Error updating application status: ' + errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'Selected':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = filterApplications();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Application Management</h2>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label htmlFor="jobId" className="block text-sm font-medium text-gray-700 mb-1">
              Job
            </label>
            <select
              id="jobId"
              name="jobId"
              value={filters.jobId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Jobs</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', jobId: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Applications ({filteredApplications.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map(application => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.name}</div>
                      <div className="text-sm text-gray-500">{application.email}</div>
                      <div className="text-sm text-gray-500">{application.phone}</div>
                      <div className="text-sm text-gray-500">{application.education}</div>
                      <div className="text-sm text-gray-500">Exp: {application.experience}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.jobId?.title}</div>
                      <div className="text-sm text-gray-500">{application.jobId?.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application._id, e.target.value)}
                          className={`w-full px-2 py-1 text-xs rounded border focus:outline-none focus:ring-1 ${
                            application.status === 'Applied' ? 'bg-yellow-50 border-yellow-200' :
                            application.status === 'Shortlisted' ? 'bg-blue-50 border-blue-200' :
                            application.status === 'Selected' ? 'bg-green-50 border-green-200' :
                            'bg-red-50 border-red-200'
                          }`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Applications by Status</h3>
          <div className="space-y-3">
            {['Applied', 'Shortlisted', 'Selected', 'Rejected'].map(status => {
              const count = applications.filter(app => app.status === status).length;
              return (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{status}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Applied Jobs</h3>
          <div className="space-y-3">
            {jobs.slice(0, 5).map(job => {
              const count = applications.filter(app => app.jobId?._id === job._id).length;
              if (count === 0) return null;
              return (
                <div key={job._id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 truncate">{job.title}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
          <button
            onClick={async () => {
              try {
                const response = await api.get('/applications/export/csv', {
                  responseType: 'blob',
                });
                
                // Create a download link
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'applications.csv');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
              } catch (error) {
                console.error('Error exporting CSV:', error);
                toast.error('Error exporting CSV: ' + (error.response?.data?.message || 'Something went wrong'));
              }
            }}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationManagement;