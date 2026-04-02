import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import myLogo from '../../assets/logo03.png';

const RecyclerHeader = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
  { name: 'Dashboard', path: '/recycler' },
  { name: 'All Requests', path: '/pickups' },
  { name: 'Accepted', path: '/pickups/accepted' },
  { name: 'Processing', path: '/processing' },
  { name: 'Reports', path: '/recycler-reports' },
];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f55a7] from-50% to-[#4db848] shadow-md">

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

        <div className="flex items-center justify-between h-14 md:h-16">

          <div className="flex-1 flex justify-start">
            <Link to="/recycler" className="flex items-center space-x-2 group">
              <img
                src={myLogo}
                className="h-6 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                alt="logo"
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
          </div>

        </div>
      </div>
    </header>
  );
};

export default RecyclerHeader;