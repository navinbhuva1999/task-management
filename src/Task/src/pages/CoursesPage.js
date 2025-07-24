import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import courseService from '../services/api/courseService';
import HomeCourseCard from '../components/HomeCourseCard';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses({ page: 1, limit: 20 });
      setCourses(response.data.courses || []);

      if (response.data.pagination) {
        setTotalItems(response.data.pagination.total_items || 0);
      }

      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourses();
  }, [fetchCourses]);

  const handleCardClick = (course) => {
    const slug = course.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') 
      .replace(/\s+/g, '-') 
      .replace(/--+/g, '-') 
      .trim();

    navigate(`/courses/${slug}`, { state: { courseId: course.id } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array(6).fill().map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm h-64 sm:h-80 animate-pulse">
              <div className="h-32 sm:h-48 bg-gray-200 rounded-t-xl"></div>
              <div className="p-3 sm:p-4">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <FiAlertCircle className="text-red-500 text-4xl sm:text-5xl mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Failed to load courses</h3>
          <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base text-center">{error?.message || 'Something went wrong. Please try again later.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (courses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <FiAlertCircle className="text-gray-400 text-4xl sm:text-5xl mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No courses found</h3>
          <p className="text-gray-500 text-sm sm:text-base">Check back later for new courses</p>
        </div>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {courses.map((course) => (
          <motion.div key={course.id} variants={itemVariants} className="h-full">
            <HomeCourseCard 
              course={course} 
              onClick={() => handleCardClick(course)}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 sm:mb-4 text-black-0 text-center">
            Our Most Popular <span className="relative font-semibold">
              Courses
              <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1.5 sm:h-2.5" />
            </span>
          </h1>
          <div className="text-center text-gray-dark-80 font-semibold leading-7 max-w-[18rem] sm:max-w-2xl mx-auto mb-6 sm:mb-3 text-sm sm:text-base px-4">
            Discover top-rated courses trusted for their quality, relevance, and real-world impact.
          </div>

          <div className="flex items-center justify-center mt-4 text-xs sm:text-sm">
            <Link to="/" className="flex items-center text-black-0">
              <div className="p-1.5 sm:p-2 rounded-full bg-purple-gradient flex items-center justify-center mr-1.5 sm:mr-2">
                <i className='icon icon-home text-white text-base sm:text-xl' />
              </div>
              <span>Home</span>
            </Link>
            <i className="icon icon-greater text-black-0 text-xs mx-2 sm:mx-4"></i>
            <span className="text-black-0 font-bold">Courses</span>
          </div>
        </div>
      </div>
      
      <div className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-0">
                  {!loading && !error && `${totalItems} Course${totalItems !== 1 ? 's' : ''} Found`}
                </h2>
              </div>

              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;
