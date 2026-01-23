import api from '../services/api';

// Utility functions for API calls

// Get all jobs
export const getAllJobs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `/jobs${queryString ? '?' + queryString : ''}`;
  const response = await api.get(url);
  return response.data;
};

// Get job by ID
export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

// Create a new job (admin only)
export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// Update a job (admin only)
export const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete a job (admin only)
export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

// Get admin all jobs
export const getAdminAllJobs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `/jobs/admin/all${queryString ? '?' + queryString : ''}`;
  const response = await api.get(url);
  return response.data;
};

// Apply to a job
export const applyToJob = async (jobId, coverNote, resumeFile) => {
  const formData = new FormData();
  formData.append('jobId', jobId);
  formData.append('coverNote', coverNote);
  formData.append('resume', resumeFile);

  const response = await api.post('/applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get user's applications
export const getUserApplications = async () => {
  const response = await api.get('/applications/me');
  return response.data;
};

// Get all applications (admin only)
export const getAllApplications = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `/applications${queryString ? '?' + queryString : ''}`;
  const response = await api.get(url);
  return response.data;
};

// Update application status (admin only)
export const updateApplicationStatus = async (id, status) => {
  const response = await api.put(`/applications/${id}/status`, { status });
  return response.data;
};

// Get applications analytics per job (admin only)
export const getApplicationsPerJob = async () => {
  const response = await api.get('/applications/analytics/jobs');
  return response.data;
};

// Export applications as CSV (admin only)
export const exportApplicationsCSV = async () => {
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
};