import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import myLogo from '../../assets/logo03.png';

const UserHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/user' },
    { name: 'My Requests', path: '/requests' },
    { name: 'History', path: '/history' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f55a7] from-50% to-[#4db848] shadow-md">

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

        <div className="flex items-center justify-between h-14 md:h-16">

          <div className="flex-1 flex justify-start">
            <Link to="/user" className="flex items-center space-x-2 group">
              <img
                src={myLogo}
                alt="logo"
                className="h-6 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center">
            <nav className="flex space-x-8 xl:space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[15px] font-[300] tracking-wide py-1 border-b-2 transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-white border-white'
                      : 'text-white/90 border-transparent hover:border-white hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden lg:flex items-center space-x-4">
              <button type="button" className="p-1.5 text-white hover:scale-110 transition-transform duration-200">
                <Search className="w-5 h-5" strokeWidth={2.0} />
              </button>
              <button type="button" className="p-1.5 text-white hover:scale-110 transition-transform duration-200">
                <User className="w-5 h-5" strokeWidth={2.0} />
              </button>
            </div>

            <div className="lg:hidden flex items-center">
              <button
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" strokeWidth={2.0} /> : <Menu className="w-7 h-7" strokeWidth={2.0} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#004d99] border-t border-white/10 shadow-xl absolute w-full left-0">
          <div className="px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-[15px] font-[300] tracking-wide transition-colors ${
                  isActive(link.path)
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}

    </header>
  );
};

export default UserHeader;