import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import { commentSchema } from "../utils/validationSchema";
import blogService from "../services/api/blogService";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import LoginConfirmationModal from "../components/ui/LoginConfirmationModal";
import CheckmarkItem from "../components/ui/CheckmarkItem";

const LoadingSkeleton = () => (
  <div className="animate-pulse max-w-4xl mx-auto">
    <div className="text-center mb-4 sm:mb-6 md:mb-7 lg:mb-8">
      <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded-full w-16 sm:w-18 md:w-20 mx-auto mb-3 sm:mb-4"></div>
      <div className="h-8 sm:h-9 md:h-10 bg-gray-200 rounded w-3/4 mx-auto mb-3 sm:mb-4"></div>
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-28 sm:w-30 md:w-32 mx-auto mb-4 sm:mb-5 md:mb-6"></div>
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
    </div>

    <div className="h-64 sm:h-80 md:h-88 lg:h-96 bg-gray-200 rounded-xl mb-4 sm:mb-6 md:mb-7 lg:mb-8"></div>

    <div className="bg-orange-50 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-7 lg:mb-8">
      <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 mb-3 sm:mb-4"></div>
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
      <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-4 sm:mb-5 md:mb-6"></div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-7 lg:gap-8 mb-8 sm:mb-10 md:mb-11 lg:mb-12">
      <div className="h-48 sm:h-56 md:h-60 lg:h-64 bg-gray-200 rounded-xl"></div>
      <div className="space-y-3 sm:space-y-4">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [commentToSubmit, setCommentToSubmit] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: blog,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlogById(id),
    staleTime: 5 * 60 * 1000,
  });

  const handleSubmitComment = (values, { setSubmitting, resetForm }) => {
    if (!user) {
      setCommentToSubmit({ values, resetForm, setSubmitting });
      setIsLoginModalOpen(true);
      return;
    }

    submitComment(values, resetForm, setSubmitting);
  };

  const submitComment = (values, resetForm, setSubmitting) => {
    const payload = {
      blog_id: id,
      comment: values.comment,
    };

    blogService.createComment(payload)
      .then((res) => {
        toast.success(res.message || `Comment submitted successfully!`);
        resetForm();
        refetch();
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || `Comment submission failed!`;
        toast.error(errorMsg);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (commentToSubmit) {
      submitComment(
        commentToSubmit.values,
        commentToSubmit.resetForm,
        commentToSubmit.setSubmitting
      );
      setCommentToSubmit(null);
    }
  };

  const renderBlogSections = () => {
    if (!blog?.blog_sections || blog.blog_sections.length === 0) {
      return null;
    }

    return blog.blog_sections.map((section, index) => {
      const isLeftImage = section.image_position === "LEFT";

      return (
        <motion.div
          key={section.id}
          className="mb-4 sm:mb-6 md:mb-7 lg:mb-8 xl:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 items-start ${isLeftImage ? '' : 'lg:grid-flow-col-dense'}`}>
            <div className={`rounded-lg sm:rounded-xl md:rounded-18px overflow-hidden shadow-md ${isLeftImage ? 'lg:order-1' : 'lg:order-2'}`}>
              <img
                src={section.section_image?.url}
                alt="Blog section"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className={`${isLeftImage ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                <p className="text-gray-dark-80 font-semibold leading-relaxed text-xs sm:text-sm md:text-[14px] lg:text-[15px]">
                  {section.section_content}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  const renderBlogDescription = () => {
    if (!blog?.blog_description) return null;

    const { question, description, points } = blog.blog_description;

    return (
      <motion.div
        className="bg-white rounded-xl mb-3 sm:mb-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div>
          <h2 className="text-base sm:text-lg md:text-xl text-black-0 font-semibold mb-3 sm:mb-4 border-l-4 border-orange-gradient pl-2 sm:pl-3">
            {question}
          </h2>
          {description && (
            <p className="text-gray-dark-80 text-sm md:text-base font-semibold leading-relaxed mb-3 sm:mb-4">
              {description}
            </p>
          )}
          <div className="space-y-3 sm:space-y-4 mt-5 sm:mt-6 md:mt-7">
            {points.map((item, index) => (
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5" key={index}>
                <CheckmarkItem key={index} description={item} />
                {index !== points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderDescription = () => {
    if (!blog?.description) return null;

    const { description } = blog;

    return (
      <motion.div
        className="bg-orange-gradient-light px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-7 lg:mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-black-0 text-center relative font-medium leading-relaxed text-sm md:text-base">
          {description}
          <i className="icon icon-quote text-black-0 opacity-10 text-4xl sm:text-5xl md:text-6xl absolute top-0 -right-6 sm:-right-8 md:-right-10"></i>
        </div>
      </motion.div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12">
          <FiAlertCircle className="text-red-500 text-4xl sm:text-5xl mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Failed to load blog</h3>
          <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">{error?.response?.data?.message || error?.message || 'Something went wrong. Please try again later.'}</p>
          <div className="flex space-x-3 sm:space-x-4">
            <button
              onClick={() => refetch()}
              className="px-3 sm:px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      );
    }

    if (!blog) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12">
          <FiAlertCircle className="text-gray-400 text-4xl sm:text-5xl mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Blog not found</h3>
          <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">The blog you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-3 sm:px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            Back to Blogs
          </button>
        </div>
      );
    }

    return (
      <motion.article
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-3 sm:mb-4 md:mb-5 lg:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-black-0 mb-2 sm:mb-3 md:mb-4 lg:mb-0 !leading-tight lg:!leading-[40px] line-clamp-3 lg:w-1/2">
              {blog.title}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center bg-orange-gradient-light justify-center text-sm md:text-base rounded-xl px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-0 gap-2 sm:gap-0">
              <div className="flex items-center">
                <i className='icon icon-calender text-gradient-orange text-base sm:text-lg md:text-xl mr-1 sm:mr-2' />
                <div className="font-medium text-xs sm:text-sm text-black-0">
                  {new Date(blog?.blog_image?.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="h-4 w-px bg-gray-light-D5 mx-2 sm:mx-3 block"></div>
                <div className="text-sm md:text-base py-1 sm:py-2 text-black-0 font-medium rounded-xl">
                  {blog.type}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {blog.blog_image?.url && (
          <motion.div
            className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 overflow-hidden shadow-lg rounded-lg sm:rounded-xl md:rounded-18px"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={blog.blog_image.url}
              alt={blog.title}
              className="w-full h-auto max-h-[280px] sm:max-h-[320px] md:max-h-[360px] lg:max-h-[400px] xl:max-h-[518px] object-cover"
              loading="eager"
            />
          </motion.div>
        )}

        {renderBlogDescription()}
        {renderDescription()}

        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
          {renderBlogSections()}
        </div>

        <motion.div
          className="border-t border-gray-light-F8 flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-xl bg-gray-light-F8 py-4 sm:py-5 md:py-6 lg:py-8 px-3 sm:px-4 md:px-5 lg:px-8 xl:px-10 pt-3 sm:pt-4 md:pt-6 lg:pt-8 mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 gap-3 sm:gap-4 lg:gap-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-center sm:justify-start gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              <h3 className="text-base md:text-lg font-medium text-black-0">Share Post</h3>
              <div className="flex space-x-2 sm:space-x-3 md:space-x-4">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-white rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all transform hover:scale-110">
                  <i className='icon icon-facebook text-gradient-orange text-base sm:text-lg md:text-xl'></i>
                </div>
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-white rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all transform hover:scale-110">
                  <i className='icon icon-x text-gradient-orange text-base sm:text-lg md:text-xl'></i>
                </div>
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-white rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all transform hover:scale-110">
                  <i className='icon icon-instagram text-gradient-orange text-base sm:text-lg md:text-xl'></i>
                </div>
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-white rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all transform hover:scale-110">
                  <i className='icon icon-linkdin text-gradient-orange text-base sm:text-lg md:text-xl'></i>
                </div>
              </div>
            </div>
            <div className="h-px w-full sm:h-4 sm:w-px bg-gray-light-D5 mx-0 sm:mx-1 hidden sm:block"></div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <div className="text-black-0 rounded-full bg-white py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 font-medium text-xs sm:text-sm">
                Learn More
              </div>
              <div className="text-black-0 rounded-full bg-white py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 font-medium text-xs sm:text-sm">
                LMS
              </div>
              <div className="text-black-0 rounded-full bg-white py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 font-medium text-xs sm:text-sm">
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-center lg:justify-end">
            <div className="flex items-center gap-2 bg-white rounded-full py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 border border-gray-light-D5 cursor-pointer">
              <i className="icon icon-left_arrow text-black-0 text-base sm:text-lg md:text-xl"></i>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 border border-gray-light-D5 cursor-pointer">
              <i className="icon icon-right_arrow text-black-0 text-base sm:text-lg md:text-xl"></i>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-light-F8 rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-base sm:text-lg md:text-xl font-medium text-black-0 mb-2 border-b border-gray-light-D5 border-opacity-40 pb-2 sm:pb-3 md:pb-4">
            {blog.blog_feedbacks?.length || 0} Comment{blog.blog_feedbacks?.length !== 1 ? 's' : ''}
          </h3>

          {blog.blog_feedbacks && blog.blog_feedbacks.length > 0 && (
            <div className="">
              {blog.blog_feedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id || index}
                  className={`flex flex-col ${blog?.blog_feedbacks?.length - 1 === index ? "pt-3 sm:pt-4 pb-2" : "py-3 sm:py-4"} rounded-lg`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                    <div className="flex flex-row items-center gap-2">
                    <div className="flex-shrink-0">
                      {feedback.user?.profile_image?.url && (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-purple-light rounded-full flex items-center justify-center text-white font-semibold">
                          <img src={feedback.user?.profile_image?.url} alt="User" className="w-full h-full object-cover rounded-full" />
                        </div>
                      )}
                      {!feedback.user?.profile_image?.url && (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-purple-light rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {feedback.user?.name ? feedback.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-black-0 text-sm sm:text-base">{feedback.user?.name || ''}</h4>
                    </div>
                    </div>
                    <div className="h-4 w-px bg-gray-300 mx-2 hidden sm:block"></div>
                    <div className="flex items-center justify-center text-base rounded-xl ml-1 sm:ml-2">
                      <i className='icon icon-calender text-gradient-orange text-base sm:text-lg md:text-xl mr-1 sm:mr-2' />
                      <div className="font-medium text-xs sm:text-sm">
                        {new Date(feedback?.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-dark-80 font-semibold leading-relaxed text-sm ml-1 sm:ml-2">{feedback.comment}</div>
                  <div className="flex items-center gap-2 bg-purple-gradient text-white rounded-full py-1.5 sm:py-2 mt-3 sm:mt-4 px-3 sm:px-4 font-medium text-xs sm:text-sm w-fit">
                    Reply
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-xl p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h4 className="text-base sm:text-lg font-semibold text-black-0 mb-3 sm:mb-4 border-b border-gray-light-D5 border-opacity-40 pb-3 sm:pb-4">Leave A Comment</h4>
          <Formik
            initialValues={{ name: '', email: '', comment: '' }}
            validationSchema={commentSchema}
            onSubmit={handleSubmitComment}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-black-0 mb-1">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter Your Name"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl  focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.name && touched.name ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-black-0 mb-1">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl  focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.email && touched.email ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm sm:text-base font-semibold text-black-0 mb-1">
                    Comment
                  </label>
                  <Field
                    as="textarea"
                    name="comment"
                    rows="4"
                    placeholder="Enter Your Comment"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl  focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.comment && touched.comment ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  <ErrorMessage name="comment" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="!rounded-full sm:w-auto bg-purple-gradient text-white px-6 py-2.5 sm:py-3 hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.article>
    );
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 sm:mb-4 text-black-0 text-center">
            Our <span className="relative font-semibold">
              Blog
              <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-2 left-0 w-full h-2.5" />
              {/* <span className="absolute -bottom-1 left-0 w-full h-1 bg-orange-gradient"></span> */}
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
            <i className="icon icon-greater text-black-0 text-xs mx-2 sm:mx-4"></i>
            <Link to="/blog" className="text-black-0 inline">
              Blog
            </Link>
            <i className="icon icon-greater text-black-0 text-xs mx-2 sm:mx-4 inline"></i>
            <span className="text-black-0 font-bold">Blog details</span>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </div>

      {/* Login Modal for unauthenticated users */}
      <LoginConfirmationModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </Layout>
  );
};

export default BlogDetailPage;
