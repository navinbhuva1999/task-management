import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FiLogOut, FiUser } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import courseService from '../../services/api/courseService';
import { specializedCertifications } from '../../utils/constant';
import Button from '../ui/Button';
import LogoutConfirmationModal from '../ui/LogoutConfirmationModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [pmCourses, setPmCourses] = useState([]);
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = '#f9fafb';
    
    return () => {
      if (metaThemeColor) {
        metaThemeColor.content = '#f9fafb';
      }
    };
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (hoveredMenu === 'home' || hoveredMenu === 'mobile-home') {
        try {
          const response = await courseService.getCourses({ page: 1, limit: 4 });
          setPmCourses(response.data.courses || []);
        } catch (error) {
        } finally {
        }
      }
    };

    fetchCourses();
  }, [hoveredMenu]);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handleCourseClick = (course) => {
    const slug = course.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    navigate(`/courses/${slug}`, { state: { courseId: course.id } });
    setHoveredMenu(null);
    setIsMenuOpen(false);
  };

  const handleSpecializedCertificationClick = (cert) => {
    window.open(cert.link, '_blank');
    setHoveredMenu(null);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center">
            <img src="/images/main_logo.svg" alt="PM - Mentors" className="h-8 lg:h-10 xl:h-11" />
          </Link>

          <button className="md:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i className='icon icon-menu text-black-0 font-bold text-xl' />
          </button>

          {/* Updated navigation with responsive spacing and font sizes */}
          <nav className="hidden md:flex items-center md:space-x-1 lg:space-x-4 xl:space-x-8">
            <Link
              to="/"
              className={`text-gray-dark-100 hover:text-purple-light px-2 lg:px-3 py-2 text-sm lg:text-base font-medium flex items-center ${isActive('/') ? 'text-purple-light' : ''}`}
            >
              Home
            </Link>

            <div className="h-4 w-px bg-gray-300 mx-1"></div>
            
            <div
              className=""
              onMouseEnter={() => setHoveredMenu('home')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link to="/courses" className={`text-gray-dark-100 hover:text-purple-light px-2 lg:px-3 py-2 flex items-center text-sm lg:text-base font-medium ${isActive('/courses') ? 'text-purple-light' : ''}`}>
                Courses
                <IoChevronDown className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
              </Link>
              <AnimatePresence>
                {hoveredMenu === 'home' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-10 mt-2 p-6 lg:p-8 xl:p-10 bg-white shadow-xl rounded-lg md:w-[600px] lg:w-[700px] xl:w-[1000px] z-20"
                  >
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <h3 className="text-lg lg:text-xl text-black-0 font-bold mb-4 lg:mb-6 xl:mb-7">Project management certifications</h3>
                        <ul className="space-y-3 lg:space-y-4">
                          {pmCourses.slice(0, 4).map(course => (
                            <li key={course.id} className="flex flex-col gap-3 lg:gap-4 xl:gap-5">
                              <button
                                onClick={() => handleCourseClick(course)}
                                className="flex items-center text-sm text-gray-dark-80 hover:text-purple-light transition-colors group"
                              >
                                <i className='icon icon-betch text-gradient-orange text-base lg:text-lg group-hover:scale-110 transition-transform' />
                                <span className='text-xs lg:text-sm font-semibold ml-2 text-gray-dark-80 group-hover:text-purple-light transition-colors'>{course.title}</span>
                              </button>
                              {pmCourses.indexOf(course) !== pmCourses.length - 1 && (
                                <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl text-black-0 font-bold mb-4 lg:mb-6 xl:mb-7">Specialized certifications</h3>
                        <ul className="space-y-3 lg:space-y-4">
                          {specializedCertifications.map((cert, index) => (
                            <li key={cert.id} className="flex flex-col gap-3 lg:gap-4 xl:gap-5">
                              <button
                                onClick={() => handleSpecializedCertificationClick(cert)}
                                className="flex items-center text-sm text-gray-dark-80 hover:text-purple-light transition-colors group"
                              >
                                <i className='icon icon-betch text-gradient-orange text-base lg:text-lg group-hover:scale-110 transition-transform' />
                                <span className='text-xs lg:text-sm font-semibold ml-2 text-gray-dark-80 group-hover:text-purple-light transition-colors'>{cert.name}</span>
                              </button>
                              {index !== specializedCertifications.length - 1 && (
                                <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-px bg-gray-300 mx-1"></div>

            <Link to="/about-us" className={`text-gray-dark-100 hover:text-purple-light px-2 lg:px-3 py-2 text-sm lg:text-base font-medium ${isActive('/about-us') ? 'text-purple-light' : ''}`}>
              About
            </Link>

            <div className="h-4 w-px bg-gray-300 mx-1"></div>

            <Link to="/blog" className={`text-gray-dark-100 hover:text-purple-light px-2 lg:px-3 py-2 text-sm lg:text-base font-medium ${isActive('/blog') ? 'text-purple-light' : ''}`}>
              Blog
            </Link>

            <div className="h-4 w-px bg-gray-300 mx-1"></div>

            <Link to="/contact" className={`text-gray-dark-100 hover:text-purple-light px-2 lg:px-3 py-2 text-sm lg:text-base font-medium ${isActive('/contact') ? 'text-purple-light' : ''}`}>
              Contact
            </Link>
          </nav>

          {/* Updated button section with responsive sizing */}
          <div className="hidden md:flex items-center md:space-x-2 lg:space-x-3 xl:space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="px-3 lg:px-4 xl:px-5 py-2 !rounded-full !font-medium flex items-center text-xs lg:text-sm">
                    <FiUser className="mr-1 lg:mr-2 text-sm" />
                    <span className="hidden lg:inline">Dashboard</span>
                    <span className="lg:hidden">Dash</span>
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  className="px-3 lg:px-4 xl:px-5 py-2 !rounded-full !font-medium flex items-center text-xs lg:text-sm"
                  onClick={handleLogout}
                >
                  <FiLogOut className="mr-1 lg:mr-2 text-sm" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/signin">
                <Button variant="primary" className="px-4 lg:px-5 xl:px-6 py-2 !rounded-full !font-bold text-xs lg:text-sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="block">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-purple-light' : 'text-gray-700 hover:text-purple-light hover:bg-gray-50'
                    }`}
                >
                  <span>Home</span>
                </Link>
              </div>
              <div className='block'>
                <button
                  onClick={() => setHoveredMenu(hoveredMenu === 'mobile-home' ? null : 'mobile-home')}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-purple-light' : 'text-gray-700 hover:text-purple-light hover:bg-gray-50'
                    }`}
                >
                  <span>Courses</span>
                  <IoChevronDown className={`h-5 w-5 transition-transform ${hoveredMenu === 'mobile-home' ? 'transform rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {hoveredMenu === 'mobile-home' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pl-4 overflow-hidden"
                    >
                      <div className="py-2">
                        <h3 className="font-semibold text-sm text-gray-900 mb-2 px-3">Project management certifications</h3>
                        <ul className="space-y-2">
                          {pmCourses.slice(0, 4).map(course => (
                            <li key={course.id}>
                              <button
                                onClick={() => handleCourseClick(course)}
                                className="block w-full text-left px-3 py-1 text-sm text-gray-dark-80 hover:text-purple-light"
                              >
                                {course.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="py-2">
                        <h3 className="font-semibold text-sm text-gray-900 mb-2 px-3">Specialized certifications</h3>
                        <ul className="space-y-2">
                          {specializedCertifications.map(cert => (
                            <li key={cert.id}>
                              <button
                                onClick={() => handleSpecializedCertificationClick(cert)}
                                className="block w-full text-left px-3 py-1 text-sm text-gray-dark-80 hover:text-purple-light"
                              >
                                {cert.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/about-us"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about-us') ? 'text-purple-light' : 'text-gray-700 hover:text-purple-light hover:bg-gray-50'
                  }`}
              >
                About
              </Link>

              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/blog') ? 'text-purple-light' : 'text-gray-700 hover:text-purple-light hover:bg-gray-50'
                  }`}
              >
                Blog
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'text-purple-light' : 'text-gray-700 hover:text-purple-light hover:bg-gray-50'
                  }`}
              >
                Contact
              </Link>

              {user ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-light hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-light hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-light hover:bg-gray-50"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </header>
  );
};

export default Header;