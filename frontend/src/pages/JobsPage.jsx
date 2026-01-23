import React, { useState, useEffect } from 'react';
import api from '../services/api';
import JobApplicationModal from '../components/JobApplicationModal';
import toast from 'react-hot-toast';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: ''
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data);
        setFilteredJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (filters.type) {
      filtered = filtered.filter(job => job.type.toLowerCase().includes(filters.type.toLowerCase()));
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    if (filters.search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      location: '',
      search: ''
    });
  };

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-lg text-gray-600">Browse through thousands of job opportunities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Job title, company..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="internship">Internship</option>
                <option value="job">Job</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, Country..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
                        job.type === 'Internship' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {job.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </p>
                    <div className="mb-3">
                      <p className="text-gray-700 line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills && job.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Apply Now
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <div className="space-x-3">
                    <button 
                      onClick={() => {
                        setSelectedJob(job);
                        setShowApplicationModal(true);
                      }}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Apply Now
                    </button>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      job.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination would go here if needed */}
        {filteredJobs.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        )}
        
        {/* Job Application Modal */}
        {showApplicationModal && selectedJob && (
          <JobApplicationModal
            job={selectedJob}
            isOpen={showApplicationModal}
            onClose={() => {
              setShowApplicationModal(false);
              setSelectedJob(null);
            }}
            onSubmit={async (jobId, coverNote, resumeFile) => {
              try {
                const formData = new FormData();
                formData.append('jobId', jobId);
                formData.append('coverNote', coverNote);
                formData.append('resume', resumeFile);

                await api.post('/applications', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
                
                toast.success('Application submitted successfully!');
                setShowApplicationModal(false);
                setSelectedJob(null);
              } catch (error) {
                console.error('Error submitting application:', error);
                const errorMessage = error.response?.data?.message || 'Failed to submit application';
                toast.error(errorMessage);
                throw new Error(errorMessage);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default JobsPage;