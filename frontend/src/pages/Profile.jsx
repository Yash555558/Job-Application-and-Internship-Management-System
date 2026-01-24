import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import ChangePassword from '../components/ChangePassword';

const Profile = () => {
  const { user: currentUser, logout, updateUserProfile: updateAuthUserProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
      setLoading(false);
    }
  }, [currentUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && user) {
      // Reset form data if canceling edit
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setError('');
      setSuccess('');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.put('/auth/profile', formData);

      if (response.status === 200) {
        setUser(response.data.user);
        updateAuthUserProfile(response.data.user); // Update context
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{user.name || 'User'}</h3>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                  <p className="text-gray-600 mt-1">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <p className="text-gray-900">{user.name || 'Not provided'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <p className="text-gray-900">{user.email || 'Not provided'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <p className="text-gray-900 capitalize">{user.role || 'user'}</p>
                    </div>

                    <div className="pt-4 space-y-3">
                      <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      >
                        Edit Profile
                      </button>
                      
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

export default Profile;