import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/layout/Layout";
import blogService from "../services/api/blogService";
import { motion } from "framer-motion";

const BlogCard = ({ post }) => {
  const navigate = useNavigate();
  const slug = post.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

  const handleClick = () => {
    navigate(`/blog/${post.id}/${slug}`);
  };

  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="w-full h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden relative">
        <img 
          src={post.blog_image?.url} 
          alt={post.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-orange-gradient text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
          {post.type}
        </div>
      </div>

      <div
        className="bg-white rounded-xl border border-gray-light-D3 shadow-sm p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:shadow-md mt-[-30px] sm:mt-[-50px] z-10 mx-2 sm:mx-3 flex-1"
        onClick={handleClick}
      >
        <div className="flex items-center bg-orange-gradient-light justify-center text-sm sm:text-base py-2 rounded-xl px-2 mb-4 sm:mb-5">
          <i className='icon icon-calender text-gradient-orange text-sm sm:text-base mr-2' />
          <div className="font-medium text-xs sm:text-sm">
            {new Date(post?.blog_image?.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <h3 className="text-sm sm:text-base font-medium text-black-0 mb-3 sm:mb-3.5 leading-tight line-clamp-2">
          {post.title}
        </h3>

        <p className="text-xs sm:text-12px text-gray-dark-80 font-semibold leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="w-full h-48 sm:h-56 lg:h-64 rounded-lg bg-gray-200"></div>
      <div className="bg-white rounded-xl border border-gray-light-D3 shadow-sm py-3 sm:py-4 px-2 sm:px-3 mt-[-30px] sm:mt-[-50px] z-10 mx-2 sm:mx-3 flex-1">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4 mb-2 sm:mb-3"></div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mb-1 sm:mb-2"></div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 mb-2 sm:mb-3"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['blogs', currentPage],
    queryFn: () => blogService.getBlogs({ page: currentPage, limit: postsPerPage }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const blogs = data?.data || [];
  const totalItems = data?.pagination?.total_items || 0;
  const totalPages = Math.ceil(totalItems / postsPerPage);
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array(6).fill().map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <FiAlertCircle className="text-red-500 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load blogs</h3>
          <p className="text-gray-500 mb-4">{error?.response?.data?.message || error?.message || 'Something went wrong. Please try again later.'}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (blogs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <FiAlertCircle className="text-gray-400 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
          <p className="text-gray-500">Check back later for new content</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {blogs.map((post, index) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 sm:mb-4 text-black-0 text-center">
            Our <span className="relative font-semibold">
              Blog
              <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-2 left-0 w-full h-auto" />
              {/* <span className="absolute -bottom-0.5 left-0 w-full h-1 bg-orange-gradient"></span> */}
            </span>
          </h1>
         <div className="text-center text-gray-dark-80 font-semibold leading-7 first-letter: max-w-[18rem] sm:max-w-2xl mx-auto mb-6 sm:mb-3 text-sm sm:text-base px-4">
            Empowering project leaders, driving career success.
          </div>
          
          <div className="flex items-center justify-center mt-4 text-xs sm:text-sm">
            <Link to="/" className="flex items-center text-black-0">
              <div className="p-1.5 sm:p-2 rounded-full bg-purple-gradient flex items-center justify-center mr-1.5 sm:mr-2">
                <i className='icon icon-home text-white text-base sm:text-xl' />
              </div>
              <span className="inline">Home</span>
            </Link>
            <i className="icon icon-greater text-black-0 text-xs mx-2 sm:mx-4 hidden sm:inline"></i>
            <span className="text-black-0 font-bold">Blog</span>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8">
          {renderContent()}

          {totalPages > 1 && !isLoading && !isError && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-purple-light hover:text-white transition-colors"
                  }`}
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  // Show first, last, current and one page before and after current
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    Math.abs(index + 1 - currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          currentPage === index + 1
                            ? "bg-purple-light text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-purple-light hover:text-white transition-colors"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  }
                  
                  // Add ellipsis if there's a gap
                  if (
                    (index === 1 && currentPage > 3) ||
                    (index === totalPages - 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={index} className="px-2">
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}

                <button
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-purple-light hover:text-white transition-colors"
                  }`}
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
