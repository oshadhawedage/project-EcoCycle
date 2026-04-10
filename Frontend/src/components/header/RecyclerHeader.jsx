import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react'; // Importing the User icon from lucide-react
import myLogo from '../../assets/logo03.png'; // Import your logo image

const RecyclerHeader = () => {
  //Get current route path (eg - /pickups, /pickups/accepted,)
  const location = useLocation();

  //Fuction to check which nav item is active
  const isActive = (path) => {
    // Special case for Pending (/pickups)
    // Only active when EXACTLY on /pickups
    if (path === "/pickups") {
      return location.pathname === "/pickups"; // exact match only
    }
    return location.pathname.startsWith(path);
  };

  // Define navigation links for the header
  const navLinks = [
    { name: 'Home', path: '/recycler/dashboard' },
    { name: 'Pending', path: '/pickups' },
    { name: 'Accepted', path: '/pickups/accepted' },
    { name: 'Collected', path: '/pickups/collected' },
    { name: 'Completed', path: '/pickups/completed' },
  ];

  return (
    // Header container (fixed at top with gradient background)
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f55a7] from-50% to-[#4db848] shadow-md">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

        {/*Header  row*/}
        <div className="flex items-center justify-between h-14 md:h-16">

           {/*Left side : Logo*/}
          <div className="flex-1 flex justify-start">
            <Link to="/recycler/dashboard" // clicking logo goes to dashboard
            className="flex items-center space-x-2 group">

              <img
                src={myLogo}
                className="h-6 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                alt="logo"
              />
            </Link>
          </div>

          {/*Center : Navigation Links (hidden on mobile)*/}
          <div className="hidden lg:flex flex-1 justify-center">
            <nav className="flex space-x-8 xl:space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name} //unique key for React list
                  to={link.path} //route path

                  // Dynamic styling:
                  // If active → underline + white text
                  // Else → faded text + hover effect
                  className={`text-[15px] font-[300] tracking-wide py-1 border-b-2 transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-white border-white'
                      : 'text-white/90 border-transparent hover:border-white hover:text-white'
                  }`}
                >
                  {link.name} {/* Display link name */}
                </Link>
              ))}
            </nav>
          </div>

          {/*Right side : User Profile Icon (hidden on mobile)*/}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden lg:flex items-center space-x-4">

              {/* Profile button → navigates to profile page */}
              <Link
                to="/recycler/profile"
                className="p-1.5 text-white hover:scale-110 transition-transform duration-200"
              >
                <User className="w-5 h-5" strokeWidth={2.0} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default RecyclerHeader;