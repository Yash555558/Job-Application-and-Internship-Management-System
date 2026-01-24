import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JobsFilterBar from '../components/JobsFilterBar';

const JobsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: ''
  });

  const [jobs, setJobs] = useState([]);
  const [isFetchingPage, setIsFetchingPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [limit] = useState(6);

  const fetchJobs = useCallback(async (page, currentFilters) => {
    try {
      setIsFetchingPage(true);

      const params = { page, limit };
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.location) params.location = currentFilters.location;
      if (currentFilters.type) params.type = currentFilters.type;

      const response = await api.get('/jobs', { params });

      if (response.data.jobs) {
        setJobs(response.data.jobs);
        setTotalPages(response.data.pagination.totalPages);
        setTotalJobs(response.data.pagination.totalJobs);
      } else {
        setJobs(response.data);
        setTotalPages(1);
        setTotalJobs(response.data.length);
      }

      setIsFetchingPage(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setIsFetchingPage(false);
    }
  }, [limit]);

  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    if (
      filters.search !== prevFiltersRef.current.search ||
      filters.location !== prevFiltersRef.current.location ||
      filters.type !== prevFiltersRef.current.type
    ) {
      setCurrentPage(1);
      prevFiltersRef.current = filters;
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs(currentPage, filters);
  }, [currentPage, filters, fetchJobs]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Opportunities
          </h1>
          <p className="text-lg text-gray-600">
            Discover roles that match your skills and career goals
          </p>
        </div>

        <JobsFilterBar onFilterChange={setFilters} />



        {/* JOB LIST */}
        <div className="relative space-y-6 mt-8">
          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            jobs.map(job => {
              // ✅ BULLETPROOF APPLIED CHECK (ONLY FIX)
              const isApplied =
                job.hasApplied === true ||
                job.applied === true ||
                job.isApplied === true;

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="hover:text-blue-600"
                            >
                              {job.title}
                            </Link>
                          </h3>

                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              job.type === 'Internship'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {job.type}
                          </span>

                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              job.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {job.isActive ? 'Active' : 'Closed'}
                          </span>

                          {isApplied && (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              Applied
                            </span>
                          )}
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="text-gray-600 text-sm">
                          📍 {job.location}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 min-w-[180px]">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-center"
                        >
                          View Details
                        </Link>

                        {!isApplied && job.isActive && (
                          <Link
                            to={`/jobs/${job._id}`}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-center"
                          >
                            Apply Now
                          </Link>
                        )}

                        {isApplied && (
                          <button
                            disabled
                            className="px-4 py-2.5 border border-gray-200 text-gray-500 font-medium rounded-lg bg-gray-100 cursor-not-allowed"
                          >
                            Applied
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION */}
        {jobs.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    disabled={isFetchingPage}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${isFetchingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {page}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
