import React, { useState } from 'react';
import toast from 'react-hot-toast';

const JobApplicationModal = ({ job, isOpen, onClose, onSubmit }) => {
  const [coverNote, setCoverNote] = useState('');
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({ resume: 'Please upload a PDF or Word document' });
        return;
      }
      
      if (file.size > maxSize) {
        setErrors({ resume: 'File size must be less than 5MB' });
        return;
      }
      
      setResume(file);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!resume) {
      setErrors({ resume: 'Please upload your resume' });
      return;
    }

    setLoading(true);
    try {
      await onSubmit(job._id, coverNote, resume);
      toast.success('Application submitted successfully!');
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit application';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCoverNote('');
    setResume(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Apply for {job?.title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Job Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{job?.title}</p>
              <p className="text-sm text-gray-600">{job?.location}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {job?.skills && job.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="coverNote" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverNote"
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell the employer why you're interested in this position..."
            />
          </div>

          <div className="mb-6">
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume *
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 5MB)</p>
                </div>
                <input 
                  id="resume" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {resume && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {errors.resume && (
              <p className="mt-2 text-sm text-red-600">{errors.resume}</p>
            )}
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;