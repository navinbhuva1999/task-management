import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BatchDetails from '../../components/dashboard/BatchDetails';
import CheckmarkItem from '../../components/ui/CheckmarkItem';
import courseService from '../../services/api/courseService';
import PurchaseSuccessModal from '../../components/ui/PurchaseSuccessModal';
import FeedbackModal from '../../components/ui/FeedbackModal';
import { BiDownload } from 'react-icons/bi';
import { useUser } from '../../context/UserContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedCurriculum, setExpandedCurriculum] = useState([]);
  const [isPurchaseSuccessModalOpen, setIsPurchaseSuccessModalOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const queryClient = useQueryClient();

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['course', id] });
  }, [queryClient, id]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getMyCourseDetail(id),
    onSuccess: (data) => {
      if (data.data.faqs && data.data.faqs.length > 0) {
        setExpandedFaq(data.data.faqs[0].id.toString());
      }
    }
  });

  const course = data?.data;

  useEffect(() => {
    setAnimateIn(true);

    const resetAnimation = () => {
      setAnimateIn(false);
      setTimeout(() => setAnimateIn(true), 50);
    };

    resetAnimation();
  }, [activeTab]);

  const toggleCurriculum = (id) => {
    if (expandedCurriculum.includes(id)) {
      setExpandedCurriculum(expandedCurriculum.filter(item => item !== id));
    } else {
      setExpandedCurriculum([...expandedCurriculum, id]);
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedTutor(null);
  };

  const handleFeedbackSubmitted = () => {
    refetch();
  };

  const handleDownloadClick = (url) => {
    window.open(url, '_blank');
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };


  if (isLoading) {
    return (
      <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300">
        <div className="bg-white rounded-[18px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300">
        <div className="bg-white rounded-[18px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FiAlertCircle className="text-red-500 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load course details</h3>
            <p className="text-gray-500 mb-4">{error?.message || 'Something went wrong. Please try again later.'}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300">
        <div className="bg-white rounded-[18px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FiAlertCircle className="text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
            <p className="text-gray-500">The course you're looking for doesn't exist or has been removed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300">
        <div className="rounded-[18px] shadow-sm overflow-hidden animate-fade-in sm:border sm:border-gray-light-D3">
          <div className="bg-white mx-6 rounded-18px shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 sm:border-none">
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-2 sm:py-3">
              <div className={`flex items-center text-sm transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <Link to="/dashboard" className="flex items-center text-black-0 transition-colors">
                  <i className='icon icon-home text-gradient-purple text-xl' />
                </Link>
                <FiChevronRight className="mx-2 text-gray-400" size={16} />
                <Link to="/dashboard/courses" className="text-black-0 transition-colors">
                  Courses
                </Link>
                <FiChevronRight className="mx-2 text-gray-400" size={16} />
                <span className="text-black-0 bg-orange-gradient-light text-12px px-3 py-1.5 rounded-full font-semibold">Course Details</span>
              </div>
              <div className="flex items-center bg-white justify-between sm:justify-center border border-gray-light-D3 w-full mt-5 sm:mt-0 sm:w-auto rounded-full p-2 sm:p-1.5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleProfileClick}>
                <div className='flex items-center'>
                  {user?.profile_image?.url ? (
                    <div className="sm:h-8 sm:w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
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

          <div className="flex flex-col lg:flex-row gap-6 mb-5">
            <div className="lg:w-2/3 space-y-6">
              <div className="bg-white ml-6 mr-6 sm:mr-0 sm:ml-5 my-5 rounded-18px shadow-sm p-4 border border-gray-light-D3 sm:border-none">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
                  <div className="text-lg sm:text-[22px] font-medium mb-0 sm:mb-2 text-black-0">{course.title}</div>
                  <span className="bg-orange-gradient-light border border-orange-light-100 text-black-0 font-bold text-xs px-4 py-2.5 rounded-full">
                    {course.level}
                  </span>
                </div>
                {course.batch && course.batch.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 sm:mt-3">
                    <div className="flex items-center text-black-0 gap-2">
                      <i className='icon icon-calender text-gradient-orange text-base sm:text-xl' />
                      <span className='text-xs sm:text-sm font-medium text-black-0'>
                        {new Date(course.batch[0].start_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-black-0 gap-2">
                      <i className='icon icon-clock text-gradient-orange text-base sm:text-xl' />
                      <span className='text-xs sm:text-sm font-medium text-black-0'>
                        {new Date(course.batch[0].start_date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {course.exam_content_outline_download &&
                      <div className="flex items-center px-4 py-2 bg-orange-gradient hover:bg-orange-gradient hover:opacity-50 transition-all duration-300 rounded-full text-black-0 gap-2 cursor-pointer" onClick={() => handleDownloadClick(course?.exam_content_outline_download)}>
                        <BiDownload className='w-4 h-4 text-white' />
                        <span className='text-xs sm:text-sm font-semibold text-white'>
                          Download
                        </span>
                      </div>
                    }
                  </div>
                )}
              </div>

              <div className="sm:bg-white rounded-18px smm:shadow-sm sm:border sm:border-gray-light-D3 ml-6 mr-6 sm:mr-0 sm:ml-5 my-5">
                <div className="flex m-0 sm:m-5">
                  {['overview', 'curriculum', 'faqs'].map((tab, index) => (
                    <div className="flex items-center" key={tab}>
                      <button
                        className={`py-2 px-4 sm:px-6 rounded-full text-xs sm:text-sm relative ${activeTab === tab ? 'bg-purple-gradient text-white font-bold' : 'text-black-0 hover:bg-gray-light-D3 font-medium'}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                      {index !== 2 && <div className="h-4 w-px bg-gray-300 mx-2 sm:mx-4"></div>}
                    </div>
                  ))}
                </div>

                <div className="px-0 sm:px-6 py-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -10 }}
                      variants={tabContentVariants}
                    >
                      {activeTab === 'overview' && (
                        <div>
                          <div className="mb-4 sm:mb-8">
                            <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">Course Overview</h2>
                            <p className="text-gray-dark-80 text-xs sm:text-base font-semibold leading-relaxed">
                              {course.overview.description}
                            </p>
                          </div>

                          {course.overview.importance_points && course.overview.importance_points.points && course.overview.importance_points.points.length > 0 && (
                            <div className="mb-4 sm:mb-8">
                              <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
                                {course.overview.importance_points.question}
                              </h2>
                              <div className="space-y-4 mt-3 sm:mt-7">
                                {course.overview.importance_points.points.map((item, index) => (
                                  <div className="flex flex-col gap-3 sm:gap-5" key={index}>
                                    <CheckmarkItem key={index} description={item} />
                                    {index !== course.overview.importance_points.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {course.overview.key_features && course.overview.key_features.sections && course.overview.key_features.sections.length > 0 && (
                            <div className="mb-4 sm:mb-8">
                              <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
                                {course.overview.key_features.title}
                              </h2>
                              <div className="space-y-4 mt-3 sm:mt-7">
                                {course.overview.key_features.sections.map((section, index) => (
                                  <div key={index} className="">
                                    <h3 className="font-semibold text-black-0 mb-2 text-sm sm:text-base">{section.subtitle}</h3>
                                    <ul className="space-y-2">
                                      {section.points.map((point, pointIndex) => (
                                        <div className="flex flex-col gap-3 sm:gap-5 mt-3 sm:mt-5" key={pointIndex}>
                                          <CheckmarkItem key={pointIndex} description={point} />
                                          {pointIndex !== section.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
                                        </div>
                                      ))}
                                    </ul>
                                    {index !== course.overview.key_features.sections.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40 mt-5"></div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {course.overview.learning_points && course.overview.learning_points.points && course.overview.learning_points.points.length > 0 && (
                            <div className="mb-4 sm:mb-8">
                              <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
                                {course.overview.learning_points.question}
                              </h2>
                              <div className="space-y-4 mt-3 sm:mt-7">
                                {course.overview.learning_points.points.map((item, index) => (
                                  <div className="flex flex-col gap-3 sm:gap-5" key={index}>
                                    <CheckmarkItem key={index} description={item} />
                                    {index !== course.overview.learning_points.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {course.overview.enrollment_criteria && course.overview.enrollment_criteria.points && course.overview.enrollment_criteria.points.length > 0 && (
                            <div className="mb-4 sm:mb-8">
                              <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
                                {course.overview.enrollment_criteria.question}
                              </h2>
                              <div className="space-y-4 mt-3 sm:mt-7">
                                {course.overview.enrollment_criteria.points.map((item, index) => (
                                  <div className="flex flex-col gap-3 sm:gap-5" key={index}>
                                    <CheckmarkItem key={index} description={item} />
                                    {index !== course.overview.enrollment_criteria.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {course.overview.training_benefits && course.overview.training_benefits.points && course.overview.training_benefits.points.length > 0 && (
                            <div className="mb-4 sm:mb-8">
                              <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
                                {course.overview.training_benefits.question || course.overview.training_benefits.title}
                              </h2>
                              <div className="space-y-4 mt-3 sm:mt-7">
                                {course.overview.training_benefits.points.map((item, index) => (
                                  <div className="flex flex-col gap-3 sm:gap-5" key={index}>
                                    <CheckmarkItem key={index} description={item} />
                                    {index !== course.overview.training_benefits.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'curriculum' && (
                        <div className="space-y-5">
                          {course.curriculum.map((item) => (
                            <motion.div
                              key={item.id}
                              className="rounded-lg shadow-sm shadow-gray-light-D3 shadow-opacity-20 overflow-hidden"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}
                            >
                              <button
                                className="w-full flex justify-between items-center px-4 py-2 sm:px-6 sm:py-4  hover:bg-gray-100 transition-colors"
                                onClick={() => toggleCurriculum(item.id.toString())}
                              >
                                <div className="flex items-center">
                                  <span className="font-semibold text-black-0 text-[13px] sm:text-base">{item.title}</span>
                                </div>
                                <div className="flex items-center">
                                  {expandedCurriculum.includes(item.id.toString()) ? <i className='icon icon-minus bg-black-0 bg-opacity-5 rounded-full px-1 py-2.5 sm:px-2 sm:py-[15px] text-black-0 text-[3px]' /> : <i className='icon icon-plus bg-black-0 bg-opacity-5 rounded-full px-1 py-1 sm:px-2 sm:py-2 text-black-0 text-base' />}
                                </div>
                              </button>
                              <AnimatePresence>
                                {expandedCurriculum.includes(item.id.toString()) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    {item.sub_chapters && item.sub_chapters.map((subChapter) => (
                                      <div key={subChapter.id} className="px-3 sm:px-6 pb-4 sm:pb-6 pt-4 border-t border-gray-light-D5 border-opacity-40 flex items-center justify-between">
                                        <div className="flex items-center ">
                                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3 bg-orange-gradient text-white">
                                            <i className='icon icon-exam text-white text-xs sm:text-20px' />
                                          </div>
                                          <p className="text-gray-dark-100 text-xs sm:text-sm font-medium leading-relaxed">
                                            {subChapter.title}
                                            {subChapter.description && <span className="block mt-1 text-xs sm:text-sm text-gray-dark-80">{subChapter.description}</span>}
                                          </p>
                                        </div>
                                        <div className="flex items-center mr-1">
                                          <i className='icon icon-lock text-gradient-purple text-2xl' />
                                        </div>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'faqs' && (
                        <div>
                          <h2 className="text-base sm:text-xl font-semibold mb-6 text-black-0 border-l-4 border-orange-gradient pl-3">FAQs for CAPM Certification Training</h2>
                          <div className="space-y-4">
                            {course.faqs.map((faq) => (
                              <motion.div
                                key={faq.id}
                                className="rounded-lg shadow-sm shadow-gray-light-D3 shadow-opacity-20 overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <button
                                  className="w-full flex justify-between items-center px-3 sm:px-6 py-2 sm:py-4 text-left font-medium hover:bg-gray-50 transition-colors"
                                  onClick={() => setExpandedFaq(expandedFaq === faq.id.toString() ? null : faq.id.toString())}
                                >
                                  <span className="text-black-0 text-sm sm:text-base font-semibold">{faq.question}</span>
                                  <motion.div
                                    animate={{ rotate: expandedFaq === faq.id.toString() ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {expandedFaq === faq.id.toString() ? <i className='icon icon-minus bg-black-0 bg-opacity-5 rounded-full px-2 py-[13px] text-black-0 text-[3px]' /> : <i className='icon icon-plus bg-black-0 bg-opacity-5 rounded-full px-2 py-2 text-black-0 text-base' />}
                                  </motion.div>
                                </button>
                                <AnimatePresence>
                                  {expandedFaq === faq.id.toString() && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-3 sm:px-6 pb-3 sm:pb-6">
                                        <p className="text-gray-dark-100 text-xs sm:text-sm font-medium leading-relaxed">{faq.answer}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 space-y-2">
              <BatchDetails
                batches={course.batch}
                setIsPurchaseSuccessModalOpen={setIsPurchaseSuccessModalOpen}
                setShowFeedbackModal={setShowFeedbackModal}
                setSelectedTutor={setSelectedTutor}
                key={course.id}
                course={course}
              />
            </div>
          </div>
        </div>
      </div>
      <PurchaseSuccessModal
        isOpen={isPurchaseSuccessModalOpen}
        onClose={() => setIsPurchaseSuccessModalOpen(false)}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedbackModal}
        tutor={selectedTutor}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </>
  );
};

export default CourseDetailPage;  