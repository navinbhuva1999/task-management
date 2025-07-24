import React, { useEffect, useState } from 'react';
import {
  FiLogOut,
  FiX
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import LogoutConfirmationModal from '../ui/LogoutConfirmationModal';

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout, user } = useUser();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Menu items
  const menuItems = [
    {
      icon: "home",
      title: 'Learner dashboard',
      path: '/dashboard',
    },
    {
      icon: "cart",
      title: 'Learning cart',
      path: '/dashboard/cart',
    },
    {
      icon: "lesson",
      title: 'My courses',
      path: '/dashboard/courses',
    },
    {
      icon: "calender",
      title: 'Batch calendar',
      path: '/dashboard/calendar',
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard/profile" && location.pathname === "/dashboard/profile") {
      return true;
    }
    if (location.pathname === "/dashboard/profile") {
      return path === "/dashboard";
    }
    else if (location.pathname.includes("/dashboard/course/")) {
      return path === "/dashboard/courses";
    }
    else if (location.pathname.includes("/dashboard/cart/")) {
      return path === "/dashboard/cart";
    }
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  useEffect(() => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = '#F4F5F8';
    
    return () => {
      if (metaThemeColor) {
        metaThemeColor.content = '#F4F5F8';
      }
    };
  }, []);

  const MobileHeader = () => (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <img src="/images/main_logo.svg" alt="PM - Mentors" className="h-8" />
      </Link>
      <button
        onClick={toggleMobileMenu}
        className="p-2 bg-white rounded-lg shadow-sm"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <FiX className="h-6 w-6 text-purple-light" />
        ) : (
          <i className='icon icon-menu text-gradient-purple text-xl'  />
        )}
      </button>
    </div>
  );

  const sidebarClasses = `
    ${windowWidth < 768 ? 'fixed inset-y-0 left-0 z-50 transform mt-14' : 'fixed top-0 left-0 h-screen z-40'} 
    ${isMobileMenuOpen ? 'translate-x-0' : windowWidth < 768 ? '-translate-x-full' : ''}
    transition-transform duration-300 ease-in-out bg-gray-light-300 shadow-sm p-6 w-[290px] flex flex-col
  `;

  return (
    <>
      <div className="flex flex-col">
        <MobileHeader />
        
        {isMobileMenuOpen && windowWidth < 768 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div className={sidebarClasses}>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="mb-5 hidden md:block">
              <Link to="/" className="flex items-center bg-white p-3 w-full rounded-20px border border-gray-light-D3">
                <img
                  src="/images/main_logo.svg"
                  alt="PM Mentors Logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            <div className="mb-6 bg-white p-4 rounded-lg border border-gray-light-D3 flex items-center">
              {user?.profile_image?.url ? (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={user?.profile_image?.url}
                    alt={user?.name || "User profile"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-gradient flex items-center justify-center">
                  <i className='icon icon-user text-white text-xl' />
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-black-0">{user?.name || "User"}</p>
                <Link to="/dashboard/profile" className="text-xs text-purple-light hover:underline">
                  View Profile
                </Link>
              </div>
            </div>

            <nav className="space-y-3">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center px-1.5 py-1.5 rounded-lg transition-all duration-200 ${isActive(item.path)
                    ? 'bg-purple-gradient text-white shadow-md'
                    : 'text-black-0 cl hover:bg-gray-100'
                    }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
                    {isActive(item.path) ? (
                      <i className={`icon icon-${item.icon} text-gradient-purple text-xl`} />
                    ) : (
                      <i className={`icon icon-${item.icon} text-gradient-orange text-xl`} />
                    )}
                  </div>
                  <span className="font-medium text-sm ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-light-D3 pt-2  mt-auto bg-gray-light-300">
            <button
              onClick={handleLogoutClick}
              className="flex items-center w-full px-1.5 py-1.5 rounded-lg transition-all duration-200 text-black-0 hover:bg-gray-100"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
                <FiLogOut className="h-5 w-5 text-red-0" />
              </div>
              <span className="font-medium text-sm ml-3">Logout</span>
            </button>
          </div>
        </div>

        {windowWidth >= 768 && <div className="ml-[290px]"></div>}

        <LogoutConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      </div>
    </>
  );
};

export default Sidebar; 