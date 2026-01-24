import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    jobId: '',
    search: '',
    jobType: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Local UI state for debounced search
  const [searchInput, setSearchInput] = useState(filters.search);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  useEffect(() => {
    fetchData();
  }, [filters, pagination.currentPage]);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput };
      });
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, 400);
    
    return () => clearTimeout(timer);
  }, [searchInput]);
  
  // Sync searchInput with filters.search when filters change
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    filterApplications();
  }, [applications, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit
      });
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.jobId) queryParams.append('jobId', filters.jobId);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.jobType) queryParams.append('jobType', filters.jobType);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      const [appsResponse, jobsResponse] = await Promise.all([
        api.get(`/applications?${queryParams.toString()}`),
        api.get('/jobs/admin/all')
      ]);
      
      setApplications(appsResponse.data.applications || appsResponse.data);
      setJobs(jobsResponse.data);
      
      // Update pagination if response includes pagination metadata
      if (appsResponse.data.pagination) {
        setPagination(appsResponse.data.pagination);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading data: ' + (error.response?.data?.message || 'Something went wrong'));
      setLoading(false);
    }
  };

  const filterApplications = () => {
    // With server-side filtering, we just return all applications
    // since filtering is handled by the server via API parameters
    return applications;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      // Update the application in the local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      // Refresh the pagination data to reflect the change
      fetchData();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Applicants
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Name, email, or skills..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
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
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="jobId" className="block text-sm font-medium text-gray-700 mb-1">
              Specific Job
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setFilters({ 
                status: '', 
                jobId: '', 
                search: '', 
                jobType: '', 
                dateFrom: '', 
                dateTo: '' 
              });
              setPagination(prev => ({...prev, currentPage: 1}));
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear All Filters
          </button>
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
                  Cover Note
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
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 max-w-xs truncate" title={application.coverNote || 'No cover note provided'}>
                        {application.coverNote || 'No cover note provided'}
                      </div>
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
        
        {/* Pagination Controls */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalApplications)}
            </span>{' '}
            of <span className="font-medium">{pagination.totalApplications}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({...prev, currentPage: Math.max(1, prev.currentPage - 1)}))}
              disabled={!pagination.hasPrevPage || loading}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-gray-50">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setPagination(prev => ({...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1)}))}
              disabled={!pagination.hasNextPage || loading}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Applications by Status</h3>
          <div className="space-y-3">
            {['Applied', 'Shortlisted', 'Selected', 'Rejected'].map(status => {
              // Count from current page applications
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
              // Count from current page applications
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