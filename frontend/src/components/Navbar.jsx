import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CareerFlow</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              <Link
                to="/"
                className={`${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200`}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className={`${
                  isActive('/jobs') 
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200`}
              >
                Jobs
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`${
                      isActive('/dashboard') 
                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    } inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200`}
                  >
                    Applicant Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`${
                        isActive('/admin') 
                          ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-500' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      } inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200`}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-slate-50 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-slate-200 shadow-lg">
          <Link
            to="/"
            className={`${isActive('/') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'} block pl-3 pr-4 py-3 rounded-lg text-base font-medium transition-all duration-200`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className={`${isActive('/jobs') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'} block pl-3 pr-4 py-3 rounded-lg text-base font-medium transition-all duration-200`}
            onClick={() => setIsMenuOpen(false)}
          >
            Jobs
          </Link>
          
          {user && (
            <>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/dashboard"
                  className={`${isActive('/dashboard') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'} block pl-3 pr-4 py-3 rounded-lg text-base font-medium transition-all duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Applicant Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`${isActive('/admin') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'} block pl-3 pr-4 py-3 rounded-lg text-base font-medium transition-all duration-200`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t border-slate-200">
                <div className="flex items-center px-3 py-3 bg-slate-50 rounded-lg mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-sm text-slate-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          )}
          
          {!user && (
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-3 text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;