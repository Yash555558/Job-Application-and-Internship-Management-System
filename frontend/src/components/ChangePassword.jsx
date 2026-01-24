import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ChangePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success(response.data.message);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (errorMessage.includes('Current password is incorrect')) {
        setErrors(prev => ({
          ...prev,
          currentPassword: errorMessage
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Enter your current password and choose a new one</p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your new password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing...
                </span>
              ) : (
                'Change Password'
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 6 characters long</li>
              <li>Should be different from your current password</li>
              <li>Choose something secure and memorable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;