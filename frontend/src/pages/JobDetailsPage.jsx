import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobApplicationModal from '../components/JobApplicationModal';
import toast from 'react-hot-toast';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.response?.data?.message || 'Failed to load job details');
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    setShowApplicationModal(true);
  };

  const handleBackClick = () => {
    navigate('/jobs');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist or has been removed.'}</p>
            <button
              onClick={handleBackClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </button>
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Job Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      job.type === 'Internship' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {job.type}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      job.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleApplyClick}
                  disabled={!job.isActive}
                  className={`px-6 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    job.isActive
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {job.isActive ? 'Apply Now' : 'Position Closed'}
                </button>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Section */}
          <div className="p-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Apply?</h3>
              <p className="text-gray-600 mb-4">
                Submit your application with your resume and cover letter. We'll review your application and get back to you soon.
              </p>
              <button
                onClick={handleApplyClick}
                disabled={!job.isActive}
                className={`px-6 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  job.isActive
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {job.isActive ? 'Apply for this Position' : 'Position Closed'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && job && (
        <JobApplicationModal
          job={job}
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false);
          }}
          onSubmit={async (jobId, applicationData) => {
            try {
              const formData = new FormData();
              formData.append('jobId', jobId);
              formData.append('name', applicationData.name);
              formData.append('email', applicationData.email);
              formData.append('phone', applicationData.phone);
              formData.append('education', applicationData.education);
              formData.append('experience', applicationData.experience);
              formData.append('skills', applicationData.skills);
              formData.append('coverNote', applicationData.coverNote);
              formData.append('resume', applicationData.resume);

              await api.post('/applications', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              
              setShowApplicationModal(false);
            } catch (error) {
              console.error('Error submitting application:', error);
              throw error;
            }
          }}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;