import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                CareerFlow
              </span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              CareerFlow is a job and internship management platform built with the
              MERN stack, helping applicants track applications and enabling admins
              to manage hiring workflows efficiently.
            </p>
          </div>
          
          {/* Applicant Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Applicant Features
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/jobs" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Browse Jobs & Internships
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Applicant Dashboard
                </a>
              </li>
              <li>
                <a href="/applications" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Application Tracking
                </a>
              </li>
              <li>
                <a href="/profile" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Profile Management
                </a>
              </li>
            </ul>
          </div>
          
          {/* Developer Info (Replaced Admin Features) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Developer Info
            </h3>
            <ul className="space-y-3">
              <li className="text-slate-400">
                Name: <span className="text-slate-300">Yash Kumar</span>
              </li>
              <li className="text-slate-400">
                Mobile: <span className="text-slate-300">9548262709</span>
              </li>
              <li>
                <a
                  href="mailto:yash777881@gmail.com"
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Email: yash777881@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/yash---kumar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  LinkedIn Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Project Info
            </h3>
            <ul className="space-y-3">
              <li className="text-slate-400">
                MERN Stack Portfolio Project
              </li>
              <li className="text-slate-400">
                Internship Assignment
              </li>
              <li className="text-slate-400">
                Real-world Hiring Workflow
              </li>
              <li className="text-slate-400">
                Role-based Access System
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-500">
              © 2026 CareerFlow. Portfolio & internship demonstration project.
            </div>
            <div className="flex space-x-6 text-sm">
              <a  className="text-slate-500 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a  className="text-slate-500 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a  className="text-slate-500 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
