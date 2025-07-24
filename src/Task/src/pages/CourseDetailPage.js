import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { BiDownload } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import CourseSchedule from '../components/CourseSchedule';
import TutorDetailsModal from '../components/dashboard/TutorDetailsModal';
import Layout from '../components/layout/Layout';
import CheckmarkItem from '../components/ui/CheckmarkItem';
import { AddToCartModal } from '../components/ui/ConfirmationModal';
import LoginConfirmationModal from '../components/ui/LoginConfirmationModal';
import { useUser } from '../context/UserContext';
import courseService from '../services/api/courseService';

const CourseOverview = ({ overview }) => {
  if (!overview) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">Course Overview</h2>
          <p className="text-gray-dark-80 text-sm font-semibold leading-loose">
            Course overview information is not available at this moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 sm:mb-8">
        <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 pl-3 border-l-4 border-orange-gradient">Course Overview</h2>
        <p className="text-gray-dark-80 text-xs sm:text-base font-semibold leading-relaxed">
          {overview.description}
        </p>
      </div>

      {overview.importance_points && overview.importance_points.points && overview.importance_points.points.length > 0 && (
        <div className="mb-4 sm:mb-8">
          <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
            {overview.importance_points.question}
          </h2>
          <div className="space-y-4 mt-3 sm:mt-7">
            {overview.importance_points.points.map((item, index) => (
              <div className="flex flex-col gap-3 sm:gap-5" key={index}>
                <CheckmarkItem key={index} description={item} />
                {index !== overview.importance_points.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {overview.key_features && overview.key_features.sections && overview.key_features.sections.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
            {overview.key_features.title}
          </h2>
          <div className="space-y-4 mt-3 sm:mt-7">
            {overview.key_features.sections.map((section, index) => (
              <div key={index} className="">
                <h3 className="font-semibold text-black-0 mb-2 text-sm sm:text-base">{section.subtitle}</h3>
                <ul className="space-y-2">
                  {section.points.map((point, pointIndex) => (
                    <div className="flex flex-col gap-3 sm:gap-5" key={pointIndex}>
                      <CheckmarkItem key={pointIndex} description={point} />
                      {pointIndex !== section.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
                    </div>
                  ))}
                </ul>
                {index !== overview.key_features.sections.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40 mt-5"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {overview.learning_points && overview.learning_points.points && overview.learning_points.points.length > 0 && (
        <div className="mb-4 sm:mb-8">
          <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
            {overview.learning_points.question}
          </h2>
          <div className="space-y-4 mt-3 sm:mt-7">
            {overview.learning_points.points.map((item, index) => (
              <div className="flex flex-col gap-3 sm:gap-5" key={index}>
                <CheckmarkItem key={index} description={item} />
                {index !== overview.learning_points.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {overview.enrollment_criteria && overview.enrollment_criteria.points && overview.enrollment_criteria.points.length > 0 && (
        <div className="mb-4 sm:mb-8">
          <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
            {overview.enrollment_criteria.question}
          </h2>
          <div className="space-y-4 mt-3 sm:mt-7">
            {overview.enrollment_criteria.points.map((item, index) => (
              <div className="flex flex-col gap-3 sm:gap-5" key={index}>
                <CheckmarkItem key={index} description={item} />
                {index !== overview.enrollment_criteria.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {overview.training_benefits && overview.training_benefits.points && overview.training_benefits.points.length > 0 && (
        <div className="mb-4 sm:mb-0">
          <h2 className="text-base sm:text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">
            {overview.training_benefits.question || overview.training_benefits.title}
          </h2>
          <div className="space-y-4 mt-3 sm:mt-7">
            {overview.training_benefits.points.map((item, index) => (
              <div className="flex flex-col gap-3 sm:gap-5" key={index}>
                <CheckmarkItem key={index} description={item} />
                {index !== overview.training_benefits.points.length - 1 && <div className="h-[1px] w-full bg-gray-light-D5 opacity-40"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CourseCurriculum = ({ curriculum = [] }) => {
  const [expandedCurriculum, setExpandedCurriculum] = useState([]);

  const toggleCurriculum = (id) => {
    if (expandedCurriculum.includes(id)) {
      setExpandedCurriculum(expandedCurriculum.filter(item => item !== id));
    } else {
      setExpandedCurriculum([...expandedCurriculum, id]);
    }
  };

  if (!curriculum || curriculum.length === 0) {
    return (
      <div>
        <h2 className="text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">Course Curriculum</h2>
        <p className="text-gray-dark-80 text-sm font-semibold">Curriculum information is not available at this moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {curriculum.map((item) => (
        <motion.div
          key={item.id}
          className="rounded-lg shadow-sm shadow-gray-light-D3 shadow-opacity-20 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}
        >
          <button
            className="w-full flex justify-between items-center px-6 py-4  hover:bg-gray-100 transition-colors"
            onClick={() => toggleCurriculum(item.id.toString())}
          >
            <div className="flex items-center">
              <span className="font-semibold text-black-0 text-base">{item.title}</span>
            </div>
            <div className="flex items-center">
              {expandedCurriculum.includes(item.id.toString()) ? <i className='icon icon-minus bg-black-0 bg-opacity-5 rounded-full px-2 py-[15px] text-black-0 text-[4px]' /> : <i className='icon icon-plus bg-black-0 bg-opacity-5 rounded-full px-2 py-2 text-black-0 text-base' />}
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
                  <div key={subChapter.id} className="px-6 pb-6 pt-4 border-t border-gray-light-D5 border-opacity-40 flex items-center justify-between">
                    <div className="flex items-center ">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-orange-gradient text-white">
                        <i className='icon icon-exam text-white text-20px' />
                      </div>
                      <p className="text-gray-dark-100 text-sm font-medium leading-relaxed">
                        {subChapter.title}
                        {subChapter.description && <span className="block mt-1 text-xs text-gray-dark-80">{subChapter.description}</span>}
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
  );
};

const CourseFaqs = ({ faqs = [] }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div>
        <h2 className="text-xl text-black-0 font-semibold mb-4 border-l-4 border-orange-gradient pl-3">FAQs</h2>
        <p className="text-gray-dark-80 text-sm font-semibold">FAQs are not available at this moment.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base sm:text-xl font-semibold mb-6 text-black-0 border-l-4 border-orange-gradient pl-3">FAQs for CAPM Certification Training</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <motion.div
            key={faq.id}
            className="rounded-lg shadow-sm shadow-gray-light-D3 shadow-opacity-20 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="w-full flex justify-between items-center px-3 sm:px-6 py-2 sm:py-4 text-left font-medium hover:bg-gray-50 transition-colors"
              onClick={() => toggleFaq(faq.id.toString())}
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
  );
};

const RelatedCourseCard = ({ course }) => {

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-48 rounded-lg overflow-hidden relative ">
        <img
          src={course.course_image?.url || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.price > 0 ? (
          <div className="bg-orange-gradient text-white text-xs font-bold px-2 py-1 rounded-full absolute top-3 right-3">
            Paid
          </div>
        ) : (
          <div className="bg-orange-gradient text-white text-xs font-bold px-2 py-1 rounded-full absolute top-3 right-3">
            Free
          </div>
        )}
      </div>

      <div
        className="bg-white rounded-xl border border-gray-light-D3 shadow-sm py-4 px-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 mt-[-30px] z-10 mx-3 flex-1"
      >
        <div className="flex items-center gap-1 justify-center mb-4 bg-orange-gradient-light rounded-xl py-2">
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-exam text-gradient-orange w-3 h-3' />
            <span className="font-medium text-10px text-black-0">{course.lessons_count || 0} Lessons</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-clock text-gradient-orange w-3 h-3' />
            <span className="font-medium text-10px text-black-0">{course.duration_weeks || 0} Week{course.duration_weeks !== 1 ? 's' : ''}</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-level text-gradient-orange w-3 h-3' />
            <span className="font-medium text-10px text-black-0">{course.level || "All Levels"}</span>
          </div>
        </div>

        <h3 className="text-sm font-medium text-black-0 mb-3 leading-tight">
          {course.title}
        </h3>

        <p className="text-10px text-gray-dark-80 font-semibold mb-3 leading-relaxed line-clamp-2">
          {course.description}
        </p>

      </div>
    </motion.div>
  );
};

const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const contentRef = useRef(null);
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);

  const extractedCourseId = courseId || (slug && slug.split('-').pop());

  const {
    data: courseData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['courseDetails', extractedCourseId],
    queryFn: () => courseService.getCourseById(extractedCourseId),
    enabled: !!extractedCourseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const course = courseData?.data;
  const relatedCourses = course?.related_courses || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug, courseId, location.pathname]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleRelatedCourseClick = (relatedCourse) => {
    const courseSlug = generateSlug(relatedCourse.title);
    navigate(`/courses/${courseSlug}`, {
      state: { courseId: relatedCourse.id }
    });
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleTutorClick = (tutor) => {
    if (tutor) {
      setSelectedTutor(tutor);
      setIsTutorModalOpen(true);
    }
  };

  const handleDownloadClick = (url) => {
    window.open(url, '_blank');
  };

  const handleBatchClick = (batch) => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      setSelectedBatch(batch);
      setIsAddToCartModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-8 sm:py-12 bg-gray-light-F8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg sm:rounded-[18px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 p-6 sm:p-8">
              <div className="flex justify-center items-center h-48 sm:h-64">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-6 sm:h-8 w-48 sm:w-64 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                  <div className="h-3 sm:h-4 w-32 sm:w-48 bg-gray-200 rounded mb-1 sm:mb-2"></div>
                  <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-8 sm:py-12 bg-gray-light-F8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg sm:rounded-[18px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 p-6 sm:p-8">
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <FiAlertCircle className="text-red-500 text-4xl sm:text-5xl mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Failed to load course details</h3>
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base text-center">{error.message || 'An error occurred while fetching course data'}</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => navigate('/courses')}
                    className="px-4 py-2 border border-purple-light text-purple-light rounded-lg hover:bg-purple-50 transition-colors text-sm sm:text-base"
                  >
                    Back to Courses
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="py-8 sm:py-12 bg-gray-light-F8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg sm:rounded-[18px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 p-6 sm:p-8">
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <FiAlertCircle className="text-gray-400 text-4xl sm:text-5xl mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Course not found</h3>
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base text-center">The course you're looking for doesn't exist or has been removed</p>
                <button
                  onClick={() => navigate('/courses')}
                  className="px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
                >
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-8 sm:py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center">
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
              <Link to="/courses" className="text-black-0">Courses</Link>
              <i className="icon icon-greater text-black-0 text-xs mx-2 sm:mx-4"></i>
              <span className="text-black-0 font-bold line-clamp-1">{course?.title}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 sm:py-16 lg:py-20 overflow-auto bg-white" ref={contentRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-5">
            <div className="lg:w-2/3 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg sm:rounded-[18px] shadow-sm p-4 sm:p-6 border border-gray-light-D3">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <span className="bg-orange-gradient-light border border-orange-gradient w-fit text-black-0 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 rounded-full">
                    {course.level}
                  </span>
                  <div className="text-base sm:text-xl lg:text-[22px] font-medium text-black-0 line-clamp-2">{course.title}</div>
                </div>
                {course.batches && course.batches.length > 0 && (
                  <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-6 mt-3 sm:mt-4">
                    <div className="flex items-center text-black-0 gap-2">
                      <i className='icon icon-calender text-gradient-orange text-lg sm:text-xl' />
                      <span className='text-xs sm:text-sm font-medium text-black-0'>
                        {new Date(course.batches[0].start_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-black-0 gap-2">
                      <i className='icon icon-clock text-gradient-orange text-lg sm:text-xl' />
                      <span className='text-xs sm:text-sm font-medium text-black-0'>
                        {new Date(course.batches[0].start_date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {course?.exam_content_outline_download && (
                      <div className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-gradient hover:bg-orange-gradient hover:opacity-50 transition-all duration-300 rounded-full text-black-0 gap-2 cursor-pointer" onClick={() => handleDownloadClick(course?.exam_content_outline_download)}>
                        <BiDownload className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
                        <span className='text-xs sm:text-sm font-semibold text-white'>
                          Download
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-lg sm:rounded-[18px] sm:shadow-sm bg-white sm:border sm:border-gray-light-D3">
                <div className="flex flex-row py-3 sm:pt-5 sm:py-5">
                  {['overview', 'Curriculum (Exam Content Outline)', 'faqs'].map((tab, index) => (
                    <div className="flex items-center w-full sm:w-auto" key={tab}>
                      <button
                        className={`py-2 px-4 sm:px-6 rounded-full text-xs sm:text-sm relative w-full sm:w-auto ${activeTab === tab ? 'bg-purple-gradient text-white font-bold' : 'text-black-0 hover:bg-gray-light-D3 font-medium'}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === 'Curriculum (Exam Content Outline)' ? 'Curriculum' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                      {index !== 2 && <div className="hidden sm:block h-4 w-px bg-gray-300 mx-2 sm:mx-4"></div>}
                    </div>
                  ))}
                </div>

                <div className="px-2 sm:px-6 py-3 sm:py-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -10 }}
                      variants={tabContentVariants}
                    >
                      {activeTab === 'overview' && <CourseOverview overview={course.overview} />}
                      {activeTab === 'Curriculum (Exam Content Outline)' && <CourseCurriculum curriculum={course.curriculum} />}
                      {activeTab === 'faqs' && <CourseFaqs faqs={course.faqs} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 space-y-2 sm:space-y-4">
              {course.batches && course.batches.length > 0 ? (
                <CourseSchedule
                  batches={course.batches}
                  onTutorClick={handleTutorClick}
                  onBatchClick={handleBatchClick}
                />
              ) : (
                <div className="bg-white rounded-lg sm:rounded-[18px] shadow-sm border border-gray-light-D3 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-center text-gray-600 mb-2 sm:mb-4">No Batches Available</h3>
                  <p className="text-gray-500 text-center text-sm sm:text-base">Check back later for upcoming batches</p>
                </div>
              )}
            </div>
          </div>

          {relatedCourses.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black-0">Related Courses</h3>
                <button
                  onClick={() => navigate('/courses')}
                  className="px-4 py-2 hidden sm:block rounded-full bg-purple-gradient text-white hover:opacity-90 transition-opacity text-sm sm:text-base font-medium"
                >
                  Browse all Courses
                </button>
              </div>
              <div className="sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 hidden ">
                {relatedCourses.slice(0, 3).map((relatedCourse) => (
                  <RelatedCourseCard
                    key={relatedCourse.id}
                    course={relatedCourse}
                    onClick={() => handleRelatedCourseClick(relatedCourse)}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 sm:hidden ">
                {relatedCourses.slice(0, 1).map((relatedCourse) => (
                  <RelatedCourseCard
                    key={relatedCourse.id}
                    course={relatedCourse}
                    onClick={() => handleRelatedCourseClick(relatedCourse)}
                  />
                ))}
                <button
                  onClick={() => navigate('/courses')}
                  className="px-6 py-2 w-fit mx-auto font-medium block sm:hidden rounded-full bg-purple-gradient text-white hover:opacity-90 transition-opacity text-sm sm:text-base"
                >
                  Browse all Courses
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals remain the same */}
      <TutorDetailsModal
        isOpen={isTutorModalOpen}
        onClose={() => setIsTutorModalOpen(false)}
        tutor={selectedTutor}
      />

      <LoginConfirmationModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />

      <AddToCartModal
        isOpen={isAddToCartModalOpen}
        onClose={() => setIsAddToCartModalOpen(false)}
        batchId={selectedBatch?.id}
        batchName={selectedBatch?.name}
      />
    </Layout>
  );
};

export default CourseDetailPage;
