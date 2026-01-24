import React, { useState, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AvatarUpload = ({ currentAvatar, onAvatarUpdate, onClose }) => {
  const [preview, setPreview] = useState(currentAvatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files[0]) {
      setError('Please select an image file first');
      return;
    }

    const file = fileInputRef.current.files[0];
    
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(response.data.message);
      
      // Update avatar in parent component
      if (onAvatarUpdate) {
        onAvatarUpdate(response.data.avatar);
      }
      
      // Refresh user data from backend to ensure consistency
      try {
        const profileResponse = await api.get('/auth/profile');
        if (onAvatarUpdate) {
          onAvatarUpdate(profileResponse.data.user.avatar);
        }
      } catch (refreshError) {
        console.warn('Failed to refresh user profile after avatar upload:', refreshError);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload avatar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      // Update user profile with empty avatar
      const response = await api.put('/auth/profile', { avatar: '' });
      
      toast.success('Avatar removed successfully');
      
      // Update avatar in parent component
      if (onAvatarUpdate) {
        onAvatarUpdate('');
      }
      
      // Refresh user data from backend to ensure consistency
      try {
        const profileResponse = await api.get('/auth/profile');
        if (onAvatarUpdate) {
          onAvatarUpdate(profileResponse.data.user.avatar || '');
        }
      } catch (refreshError) {
        console.warn('Failed to refresh user profile after avatar removal:', refreshError);
      }
      
      setPreview('');
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove avatar';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Update Profile Picture</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Upload a new profile picture or remove current one</p>
        </div>
        
        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar Preview */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300">
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {preview && (
                <button
                  onClick={() => setPreview('')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* File Input */}
            <div className="w-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Choose Image</span>
                  <span className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, or WebP (Max 2MB)</span>
                </div>
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3 w-full">
              <button
                onClick={handleUpload}
                disabled={loading || !preview || !fileInputRef.current?.files[0]}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Upload Avatar'
                )}
              </button>
              
              {(currentAvatar || preview) && (
                <button
                  onClick={handleRemove}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Remove
                </button>
              )}
              
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">Avatar guidelines:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Maximum file size: 2MB</li>
              <li>Supported formats: JPEG, PNG, GIF, WebP</li>
              <li>Image will be cropped to a square</li>
              <li>For best results, use a clear face photo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;