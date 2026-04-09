import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Settings, Home, LogOut } from 'lucide-react';
import myLogo from '../../assets/logo03.png';
import API, { setAuthToken } from '../../services/api';

const RecyclerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await API.get('/users/me');
        setUserData(userRes.data.user);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await API.post('/users/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAuthToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  // Close profile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isProfileMenuOpen) return;
      const node = profileMenuRef.current;
      if (node && !node.contains(e.target)) setIsProfileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

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

              {/* Profile Menu Button */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white font-semibold text-sm"
                  title="Profile Menu"
                >
                  {userData?.fullName?.charAt(0) || 'R'}
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl z-50 overflow-hidden">
                    {/* User Info Section */}
                    <div className="px-4 py-4 bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white">
                      <p className="font-semibold text-sm">{userData?.fullName || 'Recycler'}</p>
                      <p className="text-xs text-white/80">{userData?.email || 'recycler@email.com'}</p>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-gray-200" />

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/recycler/profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-sm transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-600" strokeWidth={2.0} />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('/recycler/settings');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-sm transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-600" strokeWidth={2.0} />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('/recycler/dashboard');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-sm transition-colors"
                      >
                        <Home className="w-4 h-4 text-gray-600" strokeWidth={2.0} />
                        <span>Dashboard</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-gray-200" />

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-3 text-sm font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2.0} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default RecyclerHeader;