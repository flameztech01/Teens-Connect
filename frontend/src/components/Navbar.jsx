import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Community', path: '/community' },
    { name: 'Activities', path: '/activities' },
    { name: 'Skills & Opportunities', path: '/skills-opportunities' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Teens Connect Logo" 
                className="h-12 w-12 object-contain transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-gray-200 ring-opacity-50"></div>
            </div>
            <div className="flex flex-col">
              <span 
                className="text-2xl font-bold tracking-tight transition-colors duration-300"
                style={{ color: '#0B4797' }}
              >
                Teens Connect
              </span>
              <span className="text-xs text-gray-500 tracking-wider font-medium mt-0.5">
                EMPOWERING YOUTH
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActiveLink(link.path)
                    ? 'text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10 tracking-wide">{link.name}</span>
                {isActiveLink(link.path) && (
                  <div 
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                    style={{ backgroundColor: '#E6A308' }}
                  ></div>
                )}
                <div 
                  className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full transition-all duration-200 ${
                    isActiveLink(link.path) ? '' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{ backgroundColor: '#E6A308' }}
                ></div>
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/join"
              className="relative px-6 py-3 rounded-md font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-md active:scale-95 group"
              style={{
                backgroundColor: '#0B4797',
                color: 'white',
              }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Join Our Community</span>
                <svg 
                  className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div 
                className="absolute inset-0 rounded-md transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: '#E6A308' }}
              ></div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-md transition-all duration-200 hover:bg-gray-50 active:bg-gray-100"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col items-center justify-center relative">
                <span 
                  className={`absolute block h-0.5 w-6 rounded-full transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45' : '-translate-y-2'
                  }`}
                  style={{ backgroundColor: isMenuOpen ? '#E6A308' : '#0B4797' }}
                ></span>
                <span 
                  className={`absolute block h-0.5 w-6 rounded-full transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ backgroundColor: '#0B4797' }}
                ></span>
                <span 
                  className={`absolute block h-0.5 w-6 rounded-full transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45' : 'translate-y-2'
                  }`}
                  style={{ backgroundColor: isMenuOpen ? '#E6A308' : '#0B4797' }}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-1 py-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3.5 text-base font-medium transition-all duration-200 rounded-lg ${
                  isActiveLink(link.path)
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                  {isActiveLink(link.path) && (
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#E6A308' }}
                    ></div>
                  )}
                </div>
              </Link>
            ))}
            
            {/* Mobile Action Buttons */}
            <div className="pt-4 mt-4 space-y-3 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center px-6 py-3.5 rounded-lg font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 hover:bg-gray-50 active:scale-95"
              >
                Sign In
              </Link>
              <Link
                to="/join"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 active:scale-95 shadow-sm hover:shadow"
                style={{
                  backgroundColor: '#0B4797',
                  color: 'white',
                }}
              >
                Join Our Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;