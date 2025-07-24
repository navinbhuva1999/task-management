import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardCourseCard from '../../components/dashboard/DashboardCourseCard';
import { FiChevronRight, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import courseService from '../../services/api/courseService';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const CoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['my-courses'] });
  }, [queryClient]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['my-courses', currentPage, itemsPerPage],
    queryFn: () => courseService.getMyCourses({ page: currentPage, limit: itemsPerPage }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const courses = data?.data?.courses || [];
  const pagination = data?.data?.pagination || {
    total_items: 0,
    total_pages: 1,
    current_page: 1,
    items_per_page: 20,
    has_next: false,
    has_previous: false
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
      }

      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return format(date, 'h:mm a');
      }

      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (e) {
      return timeString;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(8).fill().map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm h-80 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-xl"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between mt-4">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <FiAlertCircle className="text-red-500 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load your courses</h3>
          <p className="text-gray-500 mb-4">{error?.response?.data?.message || error?.message || 'Something went wrong. Please try again later.'}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <FiRefreshCw className={`${isFetching ? 'animate-spin' : ''}`} />
            Try Again
          </button>
        </div>
      );
    }

    if (courses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <FiAlertCircle className="text-gray-400 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse Courses
          </button>
        </div>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {courses.map((course) => {
          const enhancedCourse = {
            ...course,
            start_date: course.batch_start_date ? formatDate(course.batch_start_date) : 'N/A',
            start_time: course.batch_start_date ? formatTime(course.batch_start_date) : 'N/A',
          };

          return (
            <motion.div key={course.id} variants={itemVariants} className="h-full">
              <DashboardCourseCard course={enhancedCourse} />
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300 animate-fade-in">
      <div className="sm:bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in sm:border sm:border-gray-light-D3 sm:mx-4">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <h1 className="text-lg md:text-2xl font-bold text-black-0">My Courses</h1>
            <div className="flex items-center bg-white justify-between sm:justify-center border border-gray-light-D3 w-full mt-5 sm:mt-0 sm:w-auto rounded-full p-1.5 sm:p-1.5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleProfileClick}>
              <div className='flex items-center'>
              {user?.profile_image?.url ? (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                  <img
                    src={user?.profile_image?.url}
                    alt={user?.name || "User profile"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-orange-gradient flex items-center justify-center mr-2">
                  <i className='icon icon-user text-white text-sm' />
                </div>
              )}
              <div className="mr-2 mb-1 text-right block">
                <span className="text-sm font-medium text-gray-dark-200">{user?.name || "User"}</span>
              </div>
              </div>
              <div className='flex items-center'>
              <div className="h-4 w-px bg-gray-light-400 mx-1 hidden sm:block"></div>
              <button className="ml-2 text-black-0 ">
                <FiChevronRight className="h-5 w-5" />
              </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 mx-6 my-2 sm:my-5 border bg-white border-gray-light-D3 rounded-18px">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-base font-bold ">
              {!isLoading && !isError && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {pagination.total_items} Course{pagination.total_items !== 1 ? 's' : ''} Found
                </motion.span>
              )}
            </h2>

            {isFetching && !isLoading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-light mr-2"></div>
                Refreshing...
              </div>
            )}
          </div>

          {renderContent()}

          {pagination.total_pages > 1 && !isLoading && !isError && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={!pagination.has_previous || isFetching}
                  className={`px-3 py-1 rounded-md transition-all ${pagination.has_previous && !isFetching
                    ? 'bg-purple-gradient text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                    .filter(page => {
                      const current = pagination.current_page;
                      return page === 1 ||
                        page === pagination.total_pages ||
                        (page >= current - 1 && page <= current + 1);
                    })
                    .map((page, index, array) => {
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;

                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="px-2 py-1 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            disabled={isFetching}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${page === pagination.current_page
                              ? 'bg-purple-gradient text-white font-medium'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-light-D3'
                              }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })
                  }
                </div>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={!pagination.has_next || isFetching}
                  className={`px-3 py-1 rounded-md transition-all ${pagination.has_next && !isFetching
                    ? 'bg-purple-gradient text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage; 