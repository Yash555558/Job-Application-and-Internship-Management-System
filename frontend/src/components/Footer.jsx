import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">CareerFlow</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              A comprehensive job application and internship management system demonstrating modern hiring workflows and administrative capabilities.
            </p>
          </div>
          
          {/* For Candidates */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Applicant Features</h3>
            <ul className="space-y-3">
              <li><a href="/jobs" className="text-slate-400 hover:text-white transition-colors duration-200">Job Search Interface</a></li>
              <li><a href="/signup" className="text-slate-400 hover:text-white transition-colors duration-200">Registration System</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Application Tracking</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Dashboard Overview</a></li>
            </ul>
          </div>
          
          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Admin Features</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Job Management</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Application Review</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Analytics Dashboard</a></li>
              <li><a href="/admin#users" className="text-slate-400 hover:text-white transition-colors duration-200">User Management</a></li>
            </ul>
          </div>
          

        </div>
        
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-500">
              &copy; 2026 CareerFlow. Portfolio demonstration project.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;