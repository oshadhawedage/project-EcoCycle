import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, UserCircle } from 'lucide-react';
import myLogo from '../../assets/logo03.png';
import API, { setAuthToken } from '../../services/api';

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const profileMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Records', path: '/admin/logs' }, 
    { name: 'Users', path: '/users' },
    { name: 'Reports', path: '/reports' },
    { name: 'Configuration', path: '/admin/settings' },
  ];

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!isProfileMenuOpen) return;
      const node = profileMenuRef.current;
      if (node && !node.contains(e.target)) setIsProfileMenuOpen(false);
    };

    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [isProfileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await API.post('/admin/logout');
    } catch {
      // Ignore network/auth errors; still clear local session.
    } finally {
      setIsProfileMenuOpen(false);
      setAuthToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('registeredEmail');
      navigate('/admin/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f55a7] from-50% to-[#4db848] shadow-md">

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-14 md:h-16">

          <div className="flex-1 flex justify-start">
            <Link to="/admin/dashboard" className="flex items-center space-x-2 group">
              <img 
                src={myLogo} 
                alt="EcoCycle Brand Logo" 
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

              <div className="flex items-center">
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center bg-white/10 rounded-full ${
                    isSearchOpen ? 'w-48 px-4 py-1.5 opacity-100 mr-2 border border-white/20' : 'w-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Search admin..."
                    autoFocus={isSearchOpen}
                    className="w-full bg-transparent text-white text-[15px] font-[300] tracking-wide focus:outline-none placeholder:text-white/60"
                  />
                </div>

                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 text-white hover:scale-110 transition-transform duration-200"
                >
                  {isSearchOpen ? (
                    <X className="w-5 h-5" strokeWidth={2.0} />
                  ) : (
                    <Search className="w-5 h-5" strokeWidth={2.0} />
                  )}
                </button>
              </div>

              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((v) => !v)}
                  className="relative p-1.5 text-white hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Open admin menu"
                >
                  {/* Glow ring (like chat icon) */}
                  {!isProfileMenuOpen && (
                    <>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-1.5 rounded-full bg-gradient-to-r from-sky-300/15 to-emerald-300/15 blur-sm opacity-70 animate-pulse -z-10"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-1.5 rounded-full border border-white/25 opacity-50 animate-ping -z-10"
                      />
                    </>
                  )}

                  <UserCircle className="relative z-10 w-6 h-6" strokeWidth={2.0} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-xs text-white/70">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {currentUser?.email || 'Admin'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" strokeWidth={2.0} />
                      <span className="font-[300] tracking-wide">Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-7 h-7" strokeWidth={2.0} />
                ) : (
                  <Menu className="w-7 h-7" strokeWidth={2.0} />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#004d99] border-t border-white/10 shadow-xl absolute w-full left-0">
          <div className="px-6 py-6 space-y-2">

            <div className="mb-4">
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                <Search className="w-4 h-4 text-white/70 mr-2" strokeWidth={2.0} />
                <input
                  type="text"
                  placeholder="Search admin..."
                  className="w-full bg-transparent text-white text-[15px] font-[300] focus:outline-none placeholder:text-white/50"
                />
              </div>
            </div>

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
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-start items-center">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center space-x-3 text-white bg-white/10 px-5 py-2.5 rounded-full hover:bg-white/20 transition-all"
              >
                <LogOut className="w-5 h-5" strokeWidth={2.0} />
                <span className="font-[300] tracking-wide">Sign out</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;