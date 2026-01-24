import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/applications/analytics/jobs');
        setAnalyticsData(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Analytics</h2>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-blue-800 text-sm font-medium mb-1">Total Jobs</div>
            <div className="text-3xl font-bold text-blue-900">{analyticsData.length}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-green-800 text-sm font-medium mb-1">Total Applications</div>
            <div className="text-3xl font-bold text-green-900">
              {analyticsData.reduce((sum, item) => sum + item.totalApplications, 0)}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-800 text-sm font-medium mb-1">Avg Applications/Job</div>
            <div className="text-3xl font-bold text-purple-900">
              {analyticsData.length > 0 
                ? Math.round(analyticsData.reduce((sum, item) => sum + item.totalApplications, 0) / analyticsData.length)
                : 0
              }
            </div>
          </div>
        </div>

        {/* Applications by Job Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Applications per Job Position</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {analyticsData.length > 0 ? (
              <div className="space-y-3">
                {analyticsData
                  .sort((a, b) => b.totalApplications - a.totalApplications)
                  .map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-32 text-sm font-medium text-gray-700 truncate">
                        {item.jobTitle}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex items-center">
                          <div 
                            className="h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-l-lg flex items-center justify-end pr-2"
                            style={{ width: `${(item.totalApplications / Math.max(...analyticsData.map(d => d.totalApplications))) * 100}%` }}
                          >
                            <span className="text-white text-xs font-medium">
                              {item.totalApplications}
                            </span>
                          </div>
                          <div 
                            className="h-6 bg-gray-200 rounded-r-lg flex-1"
                            style={{ width: `${100 - (item.totalApplications / Math.max(...analyticsData.map(d => d.totalApplications))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>No application data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData
                  .sort((a, b) => b.totalApplications - a.totalApplications)
                  .map((item, index) => {
                    const percentage = analyticsData.length > 0 
                      ? ((item.totalApplications / analyticsData.reduce((sum, d) => sum + d.totalApplications, 0)) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.jobTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.totalApplications}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span>{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;