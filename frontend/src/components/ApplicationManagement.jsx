import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    jobId: '',
    search: '',
    jobType: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const [searchInput, setSearchInput] = useState(filters.search);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Fetch applications from the backend
  const fetchApplications = async (page = 1, currentFilters = {}) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page,
        limit: 10
      });
      
      if (currentFilters.status) queryParams.append('status', currentFilters.status);
      if (currentFilters.jobId) queryParams.append('jobId', currentFilters.jobId);
      if (currentFilters.search) queryParams.append('search', currentFilters.search);
      if (currentFilters.jobType) queryParams.append('jobType', currentFilters.jobType);
      if (currentFilters.dateFrom) queryParams.append('dateFrom', currentFilters.dateFrom);
      if (currentFilters.dateTo) queryParams.append('dateTo', currentFilters.dateTo);
      
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
      
      setError('');
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.message || 'Failed to load applications');
      toast.error('Error loading applications: ' + (error.response?.data?.message || 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search input
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput
      }));
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchApplications(currentPage, filters);
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'search') {
      // Use local state for immediate feedback
      setSearchInput(value);
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      
      // Update the application in the local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      toast.success('Application status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating application status: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      jobId: '',
      search: '',
      jobType: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchInput('');
    setCurrentPage(1);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedApplication(null);
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Management</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Applicants</label>
            <input
              type="text"
              name="search"
              value={searchInput}
              onChange={handleFilterChange}
              placeholder="Name, email, or skills..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specific Job</label>
            <select
              name="jobId"
              value={filters.jobId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Jobs</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <div className="mb-6">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Clear All Filters
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}
        
        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cover Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={application.coverNote || 'No cover note provided'}>
                    {application.coverNote || 'No cover note provided'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.appliedAt)}
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
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages || 1))}
                disabled={currentPage === (pagination.totalPages || 1)}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * 10, pagination.totalApplications || 0)}</span> of{' '}
                  <span className="font-medium">{pagination.totalApplications || 0}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {(() => {
                    const totalPages = pagination.totalPages || 1;
                    let pages = [];
                    
                    if (totalPages <= 5) {
                      // If total pages <= 5, show all pages
                      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                    } else {
                      // Show first page, last page, current page, and neighbors
                      const pagesSet = new Set();
                      
                      // Always show first and last pages
                      pagesSet.add(1);
                      pagesSet.add(totalPages);
                      
                      // Add current page and 2 neighbors on each side
                      for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
                        pagesSet.add(i);
                      }
                      
                      pages = Array.from(pagesSet).sort((a, b) => a - b);
                    }
                    
                    return pages.map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages || 1))}
                    disabled={currentPage === (pagination.totalPages || 1)}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
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

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Applicant Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedApplication.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedApplication.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedApplication.phone}</p>
                    <p><span className="font-medium">Education:</span> {selectedApplication.education}</p>
                    <p><span className="font-medium">Experience:</span> {selectedApplication.experience} years</p>
                    <p><span className="font-medium">Skills:</span> {Array.isArray(selectedApplication.skills) ? selectedApplication.skills.join(', ') : selectedApplication.skills}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Job Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Job Title:</span> {selectedApplication.jobId?.title}</p>
                    <p><span className="font-medium">Job Type:</span> {selectedApplication.jobId?.type}</p>
                    <p><span className="font-medium">Location:</span> {selectedApplication.jobId?.location}</p>
                    <p><span className="font-medium">Applied Date:</span> {formatDate(selectedApplication.appliedAt)}</p>
                    <p><span className="font-medium">Current Status:</span> 
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Cover Letter</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedApplication.coverNote || 'No cover letter provided.'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Status History</h4>
                <div className="space-y-2">
                  {(selectedApplication.statusHistory || []).map((history, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(history.status)}`}>
                        {history.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(history.changedAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {(!selectedApplication.statusHistory || selectedApplication.statusHistory.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No status history available.</p>
                  )}
                </div>
              </div>
              
              {selectedApplication.resumeLink && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Resume</h4>
                  <a 
                    href={selectedApplication.resumeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;