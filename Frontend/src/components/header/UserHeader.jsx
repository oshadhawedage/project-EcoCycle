import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Briefcase } from 'lucide-react';
import myLogo from '../../assets/logo03.png';
import API from '../../services/api';

const UserHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRecyclerModal, setShowRecyclerModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [recyclerRequest, setRecyclerRequest] = useState(null);
  const location = useLocation();

  // Fetch user data and recycler request status
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get('/users/me');
        setUserData(userRes.data.user);

        // Only fetch recycler request if user is not already a recycler
        if (userRes.data.user.role === 'USER') {
          try {
            const recyclerRes = await API.get('/users/recycler-request/me');
            setRecyclerRequest(recyclerRes.data.request);
          } catch (err) {
            // No recycler request found yet
            setRecyclerRequest(null);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchData();
  }, []);

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
            {/* Become Recycler Button - Only show if USER role */}
            {userData?.role === 'USER' && (
              <button
                onClick={() => setShowRecyclerModal(true)}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-[300] text-[14px] tracking-wide transition-all duration-200 ${
                  recyclerRequest?.status === 'PENDING'
                    ? 'bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30'
                    : recyclerRequest?.status === 'REJECTED'
                    ? 'bg-red-500/20 text-red-100 hover:bg-red-500/30'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
                title={recyclerRequest?.status ? `Status: ${recyclerRequest.status}` : 'Become a Recycler Partner'}
              >
                <Briefcase className="w-4 h-4" strokeWidth={2.0} />
                <span>
                  {recyclerRequest?.status === 'PENDING'
                    ? 'Request Pending ⏳'
                    : recyclerRequest?.status === 'REJECTED'
                    ? 'Resubmit'
                    : 'Become Recycler'}
                </span>
              </button>
            )}

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

            {/* Mobile Become Recycler Button */}
            {userData?.role === 'USER' && (
              <button
                onClick={() => {
                  setShowRecyclerModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-[15px] font-[300] tracking-wide transition-colors flex items-center gap-2 ${
                  recyclerRequest?.status === 'PENDING'
                    ? 'bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30'
                    : recyclerRequest?.status === 'REJECTED'
                    ? 'bg-red-500/20 text-red-100 hover:bg-red-500/30'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Briefcase className="w-4 h-4" strokeWidth={2.0} />
                <span>
                  {recyclerRequest?.status === 'PENDING'
                    ? 'Request Pending ⏳'
                    : recyclerRequest?.status === 'REJECTED'
                    ? 'Resubmit'
                    : 'Become Recycler'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recycler Request Modal */}
      {showRecyclerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="bg-gradient-to-r from-[#0f55a7] to-[#4db848] p-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-white" strokeWidth={2.0} />
                <h2 className="text-white text-xl font-semibold">Become a Recycler</h2>
              </div>
            </div>

            <div className="p-6">
              {recyclerRequest?.status && (
                <div className={`mb-6 p-4 rounded-lg ${
                  recyclerRequest.status === 'PENDING'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : recyclerRequest.status === 'REJECTED'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    recyclerRequest.status === 'PENDING'
                      ? 'text-yellow-700'
                      : recyclerRequest.status === 'REJECTED'
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}>
                    Status: <strong>{recyclerRequest.status}</strong>
                  </p>
                  {recyclerRequest.adminNote && (
                    <p className="text-sm mt-2">
                      Admin Note: {recyclerRequest.adminNote}
                    </p>
                  )}
                </div>
              )}

              <p className="text-gray-600 text-sm mb-6">
                Join our network of recycling partners and help us build a sustainable future. Fill in the details below to submit your request for review.
              </p>

              <button
                onClick={() => setShowRecyclerModal(false)}
                className="w-full"
              >
                <Link
                  to="/recycler-request"
                  className="block w-full bg-gradient-to-r from-[#0f55a7] to-[#4db848] text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow duration-200 text-center"
                >
                  Continue to Form
                </Link>
              </button>

              <button
                onClick={() => setShowRecyclerModal(false)}
                className="w-full mt-3 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default UserHeader;