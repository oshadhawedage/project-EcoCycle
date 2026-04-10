import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPageHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 no-underline group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white text-xl font-bold">♻️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">EcoCycle</h1>
                <p className="text-xs text-gray-500 -mt-1">E-Waste Solutions</p>
              </div>
            </Link>
          </div>

          {/* Enhanced Navigation - Desktop */}
          <nav className="hidden lg:flex">
            <ul className="flex list-none gap-1 m-0 p-0">
              <li>
                <a
                  href="#features"
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition-all duration-300 rounded-lg hover:bg-green-50 group"
                >
                  Features
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 group-hover:w-1/2 transition-all duration-300"></span>
                  <span className="absolute bottom-0 right-1/2 w-0 h-0.5 bg-green-600 group-hover:w-1/2 transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition-all duration-300 rounded-lg hover:bg-green-50 group"
                >
                  How It Works
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 group-hover:w-1/2 transition-all duration-300"></span>
                  <span className="absolute bottom-0 right-1/2 w-0 h-0.5 bg-green-600 group-hover:w-1/2 transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition-all duration-300 rounded-lg hover:bg-green-50 group"
                >
                  About
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 group-hover:w-1/2 transition-all duration-300"></span>
                  <span className="absolute bottom-0 right-1/2 w-0 h-0.5 bg-green-600 group-hover:w-1/2 transition-all duration-300"></span>
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition-all duration-300 rounded-lg hover:bg-green-50 group"
                >
                  Contact
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 group-hover:w-1/2 transition-all duration-300"></span>
                  <span className="absolute bottom-0 right-1/2 w-0 h-0.5 bg-green-600 group-hover:w-1/2 transition-all duration-300"></span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Enhanced Auth Buttons - Desktop */}
          <div className="hidden lg:flex gap-3 items-center">
            <Link
              to="/login"
              className="text-gray-700 font-medium px-6 py-2.5 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all duration-300 no-underline"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-white font-medium px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-500 rounded-xl hover:from-green-600 hover:to-green-700 hover:border-green-600 hover:shadow-lg transition-all duration-300 no-underline transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Enhanced Mobile Menu Toggle */}
          <button
            className="lg:hidden flex flex-col gap-1.5 bg-none border-none cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 right-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 transition-all duration-300 ${
        menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ul className="flex flex-col list-none gap-2 m-0 p-0">
            <li>
              <a
                href="#features"
                className="block px-4 py-3 text-gray-700 font-medium hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                ✨ Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="block px-4 py-3 text-gray-700 font-medium hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                🚀 How It Works
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="block px-4 py-3 text-gray-700 font-medium hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                📖 About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block px-4 py-3 text-gray-700 font-medium hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                📞 Contact
              </a>
            </li>
          </ul>
          <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/login"
              className="text-center text-gray-700 font-medium px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all duration-300 no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-center text-white font-medium px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-500 rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Get Started Free
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LandingPageHeader;
