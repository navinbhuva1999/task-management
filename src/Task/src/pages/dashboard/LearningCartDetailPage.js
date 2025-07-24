import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import courseService from '../../services/api/courseService';
import CourseSchedule from '../../components/dashboard/CourseSchedule';
import RelatedCourses from '../../components/dashboard/RelatedCourses';
import CheckmarkItem from '../../components/ui/CheckmarkItem';
import TutorDetailsModal from '../../components/dashboard/TutorDetailsModal';
import Loader from '../../components/ui/Loader';
import { useUser } from '../../context/UserContext';

const LearningCartDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedCurriculum, setExpandedCurriculum] = useState([]);
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();

  const { data: courseData, isLoading, isError } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id
  });

  const course = courseData?.data;

  useEffect(() => {
    setAnimateIn(true);

    const resetAnimation = () => {
      setAnimateIn(false);
      setTimeout(() => setAnimateIn(true), 50);
    };

    resetAnimation();
  }, [activeTab]);

  const handleOpenTutorModal = (tutor) => {
    if (tutor) {
      setSelectedTutor(tutor);
      setIsTutorModalOpen(true);
    }
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const handleBatchClick = (batch) => {
    alert("Batch added to your learning cart!");
  };

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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Failed to load course details</h2>
          <p className="text-gray-500 mb-4">Please try again later</p>
          <Link to="/dashboard/cart" className="bg-purple-light text-white px-4 py-2 rounded-md">
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300">
      <div className="sm:bg-white rounded-[18px] shadow-sm overflow-hidden animate-fade-in sm:border border-gray-light-D3">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in px-6 py-4 mx-6 sm:mx-0">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <div className={`flex items-center text-sm transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <Link to="/dashboard" className="flex items-center text-black-0 transition-colors">
                <i className='icon icon-home text-gradient-purple text-xl' />
              </Link>
              <FiChevronRight className="mx-1 sm:mx-2 text-gray-400" size={16} />
              <Link to="/dashboard/cart" className="flex items-center text-black-0 transition-colors">
                <span className="text-xs sm:text-sm">Learning Cart</span>
              </Link>
              <FiChevronRight className="mx-1 sm:mx-2 text-gray-400" size={16} />
              <span className="text-black-0 bg-orange-gradient-light text-12px px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold">Course Details</span>
            </div>
            <div className="flex items-center bg-white justify-between sm:justify-center border border-gray-light-D3 w-full mt-5 sm:mt-0 sm:w-auto rounded-full p-1.5 sm:p-1.5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleProfileClick}>
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

        <div className="block lg:hidden px-4 sm:px-5 my-4">
          <div className=" bg-white rounded-18px shadow-sm p-4 mb-4 mt-4 border border-gray-light-D3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
              <div className="text-base sm:text-[22px] font-medium text-black-0">{course.title}</div>
              <span className="bg-orange-gradient-light border border-orange-light-100 text-black-0 font-bold text-xs px-3 py-2 sm:px-4 sm:py-3 rounded-full w-fit">
                {course.level || 'All Levels'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {course.batches && course.batches.length > 0 && (
                <>
                  <div className="flex items-center text-black-0 gap-2">
                    <i className='icon icon-calender text-gradient-orange text-base sm:text-xl' />
                    <span className='text-xs sm:text-sm font-medium text-black-0'>
                      {formatDate(course.batches[0].start_date)}
                    </span>
                  </div>
                  <div className="flex items-center text-black-0 gap-2">
                    <i className='icon icon-clock text-gradient-orange text-base sm:text-xl' />
                    <span className='text-xs sm:text-sm font-medium text-black-0'>
                      {formatTime(course.batches[0].start_date)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <CourseSchedule
            batches={course.batches || []}
            onTutorClick={handleOpenTutorModal}
            onBatchClick={handleBatchClick}
          />
          <div className="mt-4">
            <RelatedCourses
              courses={course.related_courses || []}
              onCourseClick={handleOpenTutorModal}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-5">
          <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6 px-4 sm:px-5 lg:pl-5 lg:pr-0">
            <div className="hidden sm:block bg-white rounded-18px shadow-sm p-4 mt-4 border border-gray-light-D3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                <div className="text-lg sm:text-[22px] font-medium mb-2 text-black-0">{course.title}</div>
                <span className="bg-orange-gradient-light text-black-0 font-bold text-xs px-3 py-2 sm:px-4 sm:py-3 rounded-full w-fit">
                  {course.level || 'All Levels'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {course.batches && course.batches.length > 0 && (
                  <>
                    <div className="flex items-center text-black-0 gap-2">
                      <i className='icon icon-calender text-gradient-orange text-xl' />
                      <span className='text-xs sm:text-sm font-medium text-black-0'>
                        {formatDate(course.batches[0].start_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-black-0 gap-2">
                      <i className='icon icon-clock text-gradient-orange text-xl' />
                      <span className='text-xs sm:text-sm font-medium text-black-0'>
                        {formatTime(course.batches[0].start_date)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="sm:bg-white rounded-18px sm:shadow-sm sm:border border-gray-light-D3">
              <div className="flex flex-wrap m-2 sm:m-5">
                {['overview', 'curriculum', 'faqs'].map((tab, index) => (
                  <div className="flex items-center mb-2 sm:mb-0" key={tab}>
                    <button
                      className={`py-1.5 sm:py-2 px-4 sm:px-6 rounded-full text-xs sm:text-sm relative ${activeTab === tab ? 'bg-purple-gradient text-white font-bold' : 'text-black-0 hover:bg-gray-light-D3 font-medium'}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                    {index !== 2 && <div className="h-4 w-px bg-gray-300 mx-2 sm:mx-4"></div>}
                  </div>
                ))}
              </div>

              <div className="px-4 sm:px-6 py-2 sm:py-4">
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

                    {/* FAQs Tab */}
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

          {/* Desktop view: Sidebar with CourseSchedule and RelatedCourses */}
          <div className="hidden lg:block lg:w-1/3 space-y-2 pr-5">
            <CourseSchedule
              batches={course.batches || []}
              onTutorClick={handleOpenTutorModal}
              onBatchClick={handleBatchClick}
            />
            <RelatedCourses
              courses={course.related_courses || []}
              onCourseClick={handleOpenTutorModal}
            />
          </div>
        </div>
      </div>

      <TutorDetailsModal
        isOpen={isTutorModalOpen}
        onClose={() => setIsTutorModalOpen(false)}
        tutor={selectedTutor}
      />
    </div>
  );
};

export default LearningCartDetailPage; 