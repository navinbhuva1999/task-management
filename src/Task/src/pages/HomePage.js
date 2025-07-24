import React, { useState, useEffect, useRef, useCallback } from 'react';
import SlideIndicator from '../components/common/SlideIndicator';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import HomeCourseCard from '../components/HomeCourseCard';
import ProjectManagementBanner from '../components/ProjectManagementBanner';
import courseService from '../services/api/courseService';
import { projectManagementFeatures, testimonials } from '../utils/constant';

const HeroSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 font-jakarta bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <div className="flex items-center gap-2 bg-orange-gradient-light rounded-full px-3 sm:px-4 border border-[#FFC1A1] py-1.5 sm:py-2 w-fit mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
              <p className="font-bold text-black-0 text-xs sm:text-sm">#Online courses 2023</p>
            </div>
            <div className="text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] xl:text-[40px] font-medium !leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 text-black-0">
              Crafting Project <span className="relative font-bold">
                Leaders With
                <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-2 lg:h-2.5" />
              </span> Industry-Leading Project <span className="relative font-bold">
                Management Courses
                <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-2 lg:h-2.5" />
              </span>
            </div>

            <div className="text-gray-dark-80 font-semibold mb-4 sm:mb-6 md:mb-7 lg:mb-8 text-sm sm:text-base md:text-[15px] lg:text-base leading-relaxed">
              Advance your skills, achieve your goals, and stand out with globally recognized certifications from PMI
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <img
              src="/images/Group 1376156601.svg"
              alt="Project Management Student"
              className="w-full h-auto rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PopularCoursesSection = ({ courses, loading, error }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef(null);

  const handleCardClick = (course) => {
    const slug = course.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    navigate(`/courses/${slug}`, { state: { courseId: course.id } });
  };

  const nextSlide = () => {
    if (currentSlide < courses.length - slidesPerView) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(Math.max(0, courses.length - slidesPerView));
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (sliderRef.current && courses.length > 0) {
      const slideWidth = 100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
  }, [currentSlide, slidesPerView, courses.length]);

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-gray-light-F8">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-7 lg:mb-8">
            <div className="mb-3 sm:mb-0 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] xl:text-[27px] font-medium mb-2 sm:mb-3 md:mb-4 text-black-0">
                Our Most Popular <span className="relative font-bold">
                  Courses
                  <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-2 lg:h-2.5" />
                </span>
              </h2>
              <p className="text-gray-dark-80 text-xs sm:text-sm md:text-[13px] lg:text-sm font-semibold mt-1 sm:mt-2">Discover top-rated courses trusted for their quality, relevance, and real-world impact.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {Array(3).fill().map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm h-56 sm:h-64 md:h-72 lg:h-80 animate-pulse">
                <div className="h-28 sm:h-32 md:h-40 lg:h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2 sm:mb-3 md:mb-4"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || courses.length === 0) {
    return (
      <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-gray-light-F8">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-7 lg:mb-8">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] xl:text-[27px] font-medium mb-2 sm:mb-3 md:mb-4 text-black-0">
                Our Most Popular <span className="relative font-bold">
                  Courses
                  <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-2 lg:h-2.5" />
                </span>
              </h2>
              <p className="text-gray-dark-80 text-xs sm:text-sm md:text-[13px] lg:text-sm font-semibold mt-1 sm:mt-2">Discover top-rated courses trusted for their quality, relevance, and real-world impact.</p>
            </div>
            <Link to="/courses" className="hidden sm:block text-xs sm:text-sm md:text-[13px] lg:text-sm bg-purple-gradient font-semibold text-white border border-purple-light px-3 sm:px-4 md:px-3.5 lg:px-4 py-1.5 sm:py-2 md:py-1.5 lg:py-2 rounded-full hover:bg-purple-light hover:text-white transition duration-300">
              Browse all courses
            </Link>
          </div>
          <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
            <p className="text-gray-dark-80 text-sm sm:text-base">No courses available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-gray-light-F8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-7 lg:mb-8">
          <div className="mb-3 sm:mb-0 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] xl:text-[27px] font-medium mb-2 sm:mb-3 md:mb-4 text-black-0">
              Our Most Popular <span className="relative font-bold">
                Courses
                <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-2 lg:h-2.5" />
              </span>
            </h2>
            <div className="text-gray-dark-80 text-xs sm:text-sm md:text-[13px] lg:text-sm font-semibold mt-1 sm:mt-2">Discover top-rated courses trusted for their quality, relevance, and real-world impact.</div>
          </div>
          <Link to="/courses" className="block w-fit mx-auto sm:mx-0 text-xs sm:text-sm md:text-[13px] lg:text-sm bg-purple-gradient font-semibold text-white border border-purple-light px-4 sm:px-4 md:px-3.5 lg:px-4 py-2 sm:py-2.5 md:py-2 lg:py-2.5 rounded-full hover:bg-purple-light hover:text-white transition duration-300">
            Browse all courses
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
          >
            {courses.map(course => (
              <div
                key={course.id}
                className={`px-0 sm:px-2 md:px-2.5 lg:px-3 ${slidesPerView === 1 ? 'min-w-full' :
                  slidesPerView === 2 ? 'min-w-[50%]' :
                    'min-w-[33.33%]'
                  }`}
              >
                <HomeCourseCard
                  course={course}
                  onClick={() => handleCardClick(course)}
                />
              </div>
            ))}
          </div>

          {courses.length > slidesPerView && (
            <>
              <div className='flex items-center gap-x-2 justify-between mt-4 sm:mt-6 md:mt-7 lg:mt-8'>
                <button
                  onClick={prevSlide}
                  className="bg-white px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                  aria-label="Previous slide"
                >
                  <i className='icon icon-left_arrow text-black-0 font-bold text-sm sm:text-base' />
                </button>
                <SlideIndicator
                  totalSlides={Math.max(0, courses.length - slidesPerView + 1)}
                  currentSlide={currentSlide}
                  onSlideClick={goToSlide}
                />
                <button
                  onClick={nextSlide}
                  className="bg-white px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                  aria-label="Next slide"
                >
                  <i className='icon icon-right_arrow text-black-0 font-bold text-sm sm:text-base' />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-light-D3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center border-b border-gray-light-D5 border-opacity-40 pb-2 sm:pb-3 md:pb-3.5 lg:pb-4 mb-2 sm:mb-3 md:mb-3.5 lg:mb-4">
        <div className="flex items-center">
          <div className="w-7 sm:w-8 md:w-9 lg:w-10 h-7 sm:h-8 md:h-9 lg:h-10 rounded-full bg-purple-gradient flex items-center justify-center mr-2 sm:mr-2.5 md:mr-2.5 lg:mr-3">
            {icon}
          </div>
        </div>
        <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black-0 leading-5 sm:leading-6">{title}</div>
      </div>
      <div className="text-xs sm:text-sm md:text-[15px] lg:text-base text-gray-dark-80 font-semibold leading-5 sm:leading-6">{description}</div>
    </motion.div>
  );
};

const PopularFeaturesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    if (currentSlide < projectManagementFeatures.length - slidesPerView) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(Math.max(0, projectManagementFeatures.length - slidesPerView));
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (sliderRef.current && projectManagementFeatures.length > 0) {
      const slideWidth = 100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
  }, [currentSlide, slidesPerView]);

  return (
    <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-[#F8F8F81A] font-jakarta">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-7 lg:mb-8">
          <div className="mb-3 sm:mb-0 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-[24px] lg:text-[26px] xl:text-[27px] font-medium mb-2 sm:mb-3 md:mb-4 text-black-0">
              Our Most Popular <span className="relative font-bold">
                Features
                <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-2 lg:h-2.5" />
              </span>
            </h2>
            <div className="text-gray-dark-80 text-center sm:text-left text-xs sm:text-sm md:text-[13px] lg:text-sm font-semibold mt-1 sm:mt-2">Discover features that make our courses stand out in the industry.</div>
          </div>
          <Link to="/courses" className="gap-1.5 sm:gap-2 w-fit mx-auto sm:mx-0 flex items-center text-xs sm:text-sm md:text-[13px] lg:text-sm bg-purple-gradient font-semibold text-white border border-purple-light px-4 sm:px-4 md:px-3.5 lg:px-4 py-2 sm:py-2.5 md:py-2 lg:py-2 rounded-full hover:bg-purple-light hover:text-white transition duration-300">
            <i className='icon icon-play text-white text-xs sm:text-sm' />
            Play Video
          </Link>
        </div>

        <div className="md:grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 hidden">
          {projectManagementFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
        <div className="relative overflow-hidden md:hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
          >
            {projectManagementFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`px-0 sm:px-2 md:px-2.5 lg:px-3 ${slidesPerView === 1 ? 'min-w-full' :
                  slidesPerView === 2 ? 'min-w-[50%]' :
                    'min-w-[33.33%]'
                  }`}
              >
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>

          {projectManagementFeatures.length > slidesPerView && (
            <>
              <div className='flex items-center gap-x-2 justify-between mt-4 sm:mt-6 md:mt-7 lg:mt-8'>
                <button
                  onClick={prevSlide}
                  className="bg-white px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                  aria-label="Previous slide"
                >
                  <i className='icon icon-left_arrow text-black-0 font-bold text-sm sm:text-base' />
                </button>
                <SlideIndicator
                  totalSlides={Math.max(0, projectManagementFeatures.length - slidesPerView + 1)}
                  currentSlide={currentSlide}
                  onSlideClick={goToSlide}
                />
                <button
                  onClick={nextSlide}
                  className="bg-white px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                  aria-label="Next slide"
                >
                  <i className='icon icon-right_arrow text-black-0 font-bold text-sm sm:text-base' />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ quote, author, email, isActive, id, prevSlide, nextSlide, isDesktop }) => {
  return (
    <motion.div
      key={id}
      className={`bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-[24px] sm:rounded-[30px] md:rounded-[35px] lg:rounded-[40px] shadow-md mx-0.5 sm:mx-1 md:mx-1.5 lg:mx-2 transition-all duration-300 ${isActive ? 'bg-orange-gradient-light scale-100 opacity-100' : 'scale-90 opacity-60'
        }`}
      whileHover={{ scale: isActive ? 1.02 : 0.95 }}
    >
      <div className="flex items-center mb-2 sm:mb-3 md:mb-3.5 lg:mb-4 gap-x-1 justify-center">
        <div className="text-yellow-400 flex gap-x-0.5 sm:gap-x-1">
          {[...Array(5)].map((_, i) => (
            <i key={i} className='icon icon-start text-xs sm:text-sm' />
          ))}
        </div>
        <span className="text-xs sm:text-sm font-medium text-black-0">4.5</span>
      </div>
      <div className="text-sm sm:text-base md:text-[15px] lg:text-base font-medium text-black-0 mb-3 sm:mb-4 text-center mx-0 sm:mx-6 md:mx-8 lg:mx-10 leading-relaxed">{quote}</div>
      <div className="border-t border-gray-light-D5 w-48 sm:w-56 md:w-64 lg:w-72 mx-auto border-opacity-40 pt-3 sm:pt-4"></div>
      <div className="flex items-center justify-center">
        <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full bg-gray-300 overflow-hidden">
          <img src={`https://i.pravatar.cc/150?u=${author}`} alt={author} className="h-full w-full object-cover" />
        </div>
        <div className="ml-2 sm:ml-2.5 md:ml-2.5 lg:ml-3">
          <p className="text-xs sm:text-sm font-medium text-black-0 mb-0.5">{author}</p>
          <p className="text-xs sm:text-sm font-medium text-black-0">{email}</p>
        </div>
      </div>
      {isActive &&
        <div className={`${isDesktop ? 'hidden sm:block' : 'hidden'}`} >
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-30 hover:bg-gray-100"
            aria-label="Previous slide"
          >
            <i className='icon icon-left_arrow text-black-0 font-bold text-sm sm:text-base' />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-30 hover:bg-gray-100"
            aria-label="Next slide"
          >
            <i className='icon icon-right_arrow text-black-0 font-bold text-sm sm:text-base' />
          </button>
        </div>
      }
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const [currentSlideMobile, setCurrentSlideMobile] = useState(0);
  const [slidesMobilePerView, setSlidesMobilePerView] = useState(1);
  const sliderRefMobile = useRef(null);

  const nextSlideMobile = () => {
    if (currentSlideMobile < projectManagementFeatures.length - slidesMobilePerView) {
      setCurrentSlideMobile(currentSlideMobile + 1);
    } else {
      setCurrentSlideMobile(0);
    }
  };

  const prevSlideMobile = () => {
    if (currentSlideMobile > 0) {
      setCurrentSlideMobile(currentSlideMobile - 1);
    } else {
      setCurrentSlideMobile(Math.max(0, projectManagementFeatures.length - slidesMobilePerView));
    }
  };

  const goToSlideMobile = (index) => {
    setCurrentSlideMobile(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesMobilePerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesMobilePerView(2);
      } else {
        setSlidesMobilePerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (sliderRefMobile.current && projectManagementFeatures.length > 0) {
      const slideWidth = 100 / slidesMobilePerView;
      sliderRefMobile.current.style.transform = `translateX(-${currentSlideMobile * slideWidth}%)`;
    }
  }, [currentSlideMobile, slidesMobilePerView]);

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-white font-jakarta">
      <div className="container mx-auto px-4 sm:px-5 md:px-8 lg:px-12 xl:px-20">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-[27px] font-medium text-center mb-2 sm:mb-3 md:mb-3 lg:mb-4">
          People Say About <span className="relative font-bold">
            PM-MENTORS
            <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-1.5 lg:-bottom-2 xl:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-1.5 lg:h-2 xl:h-2.5" />
          </span>
        </h2>
        <p className="text-center text-gray-dark-80 leading-4 sm:leading-4 md:leading-5 lg:leading-5 font-semibold mb-6 sm:mb-8 md:mb-9 lg:mb-10 xl:mb-12 text-xs sm:text-sm md:text-sm lg:text-base">
          What learners and professionals say about PM-MENTORS — real stories, real impact.
        </p>

        <div className="relative hidden lg:block">
          <div className="flex justify-center items-center">
            {testimonials.map((testimonial, index) => {
              const position = (index - currentSlide + testimonials.length) % testimonials.length;
              let positionClass = '';

              if (position === 0) {
                positionClass = 'left-0 z-10';
              } else if (position === 1) {
                positionClass = 'left-1/2 transform -translate-x-1/2 z-20';
              } else {
                positionClass = 'right-0 z-10';
              }

              return (
                <div
                  key={testimonial.id}
                  className={`transition-all duration-500 absolute ${positionClass}`}
                  style={{
                    width: position === 1 ? '40%' : '30%',
                    opacity: position === 1 ? 1 : 0.7
                  }}
                >
                  <TestimonialCard
                    {...testimonial}
                    key={testimonial.id}
                    isActive={position === 1}
                    prevSlide={prevSlide}
                    isDesktop={true}
                    nextSlide={nextSlide}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative overflow-hidden lg:hidden">
          <div
            ref={sliderRefMobile}
            className="flex transition-transform duration-500 ease-in-out"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`px-0 sm:px-2 md:px-3 ${slidesMobilePerView === 1 ? 'min-w-full' :
                  slidesMobilePerView === 2 ? 'min-w-[50%]' :
                    'min-w-[33.33%]'
                  }`}
              >
                <TestimonialCard
                  {...testimonial}
                  key={testimonial.id}
                  isDesktop={false}
                  isActive={index === currentSlideMobile}
                  prevSlide={prevSlideMobile}
                  nextSlide={nextSlideMobile}
                />
              </div>
            ))}
          </div>

          {testimonials.length > slidesMobilePerView && (
            <>
              <div className='flex items-center gap-x-1 sm:gap-x-1.5 md:gap-x-2 justify-between mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8'>
                <button
                  onClick={prevSlideMobile}
                  className="bg-white px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                  aria-label="Previous slide"
                >
                  <i className='icon icon-left_arrow text-black-0 font-bold text-xs sm:text-sm md:text-sm lg:text-base' />
                </button>
                <SlideIndicator
                  totalSlides={Math.max(0, testimonials.length - slidesMobilePerView + 1)}
                  currentSlide={currentSlideMobile}
                  onSlideClick={goToSlideMobile}
                />
                <button
                  onClick={nextSlideMobile}
                  className="bg-white px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                  aria-label="Next slide"
                >
                  <i className='icon icon-right_arrow text-black-0 font-bold text-xs sm:text-sm md:text-sm lg:text-base' />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const BatchCard = ({ course, onClick }) => {
  return (
    <motion.div
      className="bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl shadow-md overflow-hidden border border-gray-light-D3 h-full cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      viewport={{ once: true }}
      onClick={onClick}
    >
      <div className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5">
        <div className="flex items-center gap-1 justify-center mb-2 sm:mb-3 md:mb-3 lg:mb-3 xl:mb-4 bg-orange-gradient-light rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl py-1 sm:py-1.5 md:py-1.5 lg:py-2">
          <div className="text-xs rounded-full flex items-center gap-0.5 sm:gap-1">
            <i className='icon icon-lesson text-gradient-orange text-xs sm:text-xs md:text-sm lg:text-sm' />
            <span className="font-medium text-8px sm:text-9px md:text-9px lg:text-10px text-black-0">{course.lessons_count || 0} Lessons</span>
          </div>
          <div className="h-2 sm:h-3 md:h-3 lg:h-4 w-px bg-gray-300 mx-0.5 sm:mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-0.5 sm:gap-1">
            <i className='icon icon-clock text-gradient-orange text-xs sm:text-xs md:text-sm lg:text-sm' />
            <span className="font-medium text-8px sm:text-9px md:text-9px lg:text-10px text-black-0">{course.duration_weeks || 0} Week{course.duration_weeks !== 1 ? 's' : ''}</span>
          </div>
          <div className="h-2 sm:h-3 md:h-3 lg:h-4 w-px bg-gray-300 mx-0.5 sm:mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-0.5 sm:gap-1">
            <i className='icon icon-level text-gradient-orange text-xs sm:text-xs md:text-sm lg:text-sm' />
            <span className="font-medium text-8px sm:text-9px md:text-9px lg:text-10px text-black-0">{course.level || "All Levels"}</span>
          </div>
        </div>

        <h3 className="text-sm sm:text-sm md:text-base lg:text-base font-semibold mb-2 sm:mb-3 md:mb-3 lg:mb-3 xl:mb-4 text-black-0 line-clamp-2">{course.title}</h3>

        <p className="text-xs sm:text-xs md:text-sm lg:text-sm font-medium leading-4 sm:leading-4 md:leading-5 lg:leading-5 text-gray-dark-80 mb-2 sm:mb-3 md:mb-3 lg:mb-3 xl:mb-4 line-clamp-2">
          {course.description || "Advance your project management skills with this comprehensive course."}
        </p>

        <div className="flex items-center mb-2 sm:mb-2 md:mb-3 lg:mb-3 border-t border-gray-300 border-opacity-40 pt-2 sm:pt-3 md:pt-3 lg:pt-3 xl:pt-4">
          <div className="flex items-center text-sm text-gray-700">
            <span className="text-gradient-orange mr-1 sm:mr-2">
              <i className='icon icon-user text-gradient-orange text-xs sm:text-xs md:text-sm lg:text-sm' />
            </span>
            <div className="flex items-center gap-x-0.5">
              {course.batch_tutor && course.batch_tutor.length > 0 ? (
                course.batch_tutor.map((tutorInfo, index) => (
                  <React.Fragment key={index}>
                    <span className="font-medium text-8px sm:text-8px md:text-9px lg:text-9px text-black-0">{tutorInfo.tutor.name}</span>
                    {index < course.batch_tutor.length - 1 && (
                      <div className="h-2 sm:h-2 md:h-3 lg:h-3 w-px bg-gray-300 mx-0.5 sm:mx-1"></div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="font-medium text-8px sm:text-8px md:text-9px lg:text-9px text-black-0">No tutors assigned</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-x-1 sm:gap-x-2 md:gap-x-2">
          <div className="flex items-center text-sm gap-x-1 sm:gap-x-2 md:gap-x-2">
            <i className='icon icon-calender text-gradient-orange text-xs sm:text-xs md:text-sm lg:text-sm' />
            <span className="font-medium text-8px sm:text-8px md:text-9px lg:text-9px text-black-0">{new Date(course.batch_start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) || 'N/A'}</span>
          </div>
          <div className="h-2 sm:h-2 md:h-3 lg:h-3 w-px bg-gray-300 mx-0.5 sm:mx-1"></div>
          <div className="flex items-center text-sm gap-x-0.5 sm:gap-x-1">
            <i className='icon icon-clock text-gradient-orange text-xs sm:text-xs md:text-sm lg:text-sm' />
            <span className="font-medium text-8px sm:text-8px md:text-9px lg:text-9px text-black-0">{new Date(course.batch_start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || 'N/A'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UpcomingBatchesSection = ({ courses, loading, error }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef(null);

  const handleCardClick = (course) => {
    const slug = course.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    navigate(`/courses/${slug}`, { state: { courseId: course.id } });
  };

  const nextSlide = () => {
    if (currentSlide < courses.length - slidesPerView) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(Math.max(0, courses.length - slidesPerView));
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (sliderRef.current && courses.length > 0) {
      const slideWidth = 100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
  }, [currentSlide, slidesPerView, courses.length]);

  if (loading) {
    return (
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-gray-light-F8 font-jakarta">
        <div className="container mx-auto px-4 sm:px-5 md:px-8 lg:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-6 lg:mb-7 xl:mb-8">
            <div className="mb-3 sm:mb-4 md:mb-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-[27px] font-bold mb-2 sm:mb-3 md:mb-3 lg:mb-4 text-gray-900">
                Upcoming <span className="relative font-bold">
                  Batches
                  <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-1.5 lg:-bottom-2 xl:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-1.5 lg:h-2 xl:h-2.5" />
                </span>
              </h2>
              <p className="text-gray-dark-80 text-xs sm:text-sm md:text-sm lg:text-sm font-semibold">
                Stay updated on upcoming batches, workshops, and webinars to boost your growth.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6">
            {Array(3).fill().map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm h-56 sm:h-64 md:h-72 lg:h-80 animate-pulse">
                <div className="p-3 sm:p-3 md:p-4 lg:p-4">
                  <div className="h-3 sm:h-3 md:h-4 lg:h-4 bg-gray-200 rounded w-3/4 mb-2 sm:mb-3 md:mb-3 lg:mb-4"></div>
                  <div className="h-2 sm:h-2 md:h-3 lg:h-3 bg-gray-200 rounded w-full mb-1 sm:mb-1 md:mb-2 lg:mb-2"></div>
                  <div className="h-2 sm:h-2 md:h-3 lg:h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || courses.length === 0) {
    return (
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-gray-light-F8 font-jakarta">
        <div className="container mx-auto px-4 sm:px-5 md:px-8 lg:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-6 lg:mb-7 xl:mb-8">
            <div className="mb-3 sm:mb-4 md:mb-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-[27px] font-normal mb-2 sm:mb-3 md:mb-3 lg:mb-4 text-gray-900">
                Upcoming <span className="relative font-semibold">
                  Batches
                  <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-1.5 lg:-bottom-2 xl:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-1.5 lg:h-2 xl:h-2.5" />
                </span>
              </h2>
              <p className="text-gray-dark-80 text-xs sm:text-sm md:text-sm lg:text-sm font-semibold">
                Stay updated on upcoming batches, workshops, and webinars to boost your growth.
              </p>
            </div>
          </div>
          <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
            <p className="text-gray-500 text-sm sm:text-sm md:text-base lg:text-base">No upcoming batches available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-gray-light-F8 font-jakarta">
      <div className="container mx-auto px-4 sm:px-5 md:px-8 lg:px-12 xl:px-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-6 lg:mb-7 xl:mb-8">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-[27px] font-bold mb-2 sm:mb-3 md:mb-3 lg:mb-4 text-gray-900">
              Upcoming <span className="relative font-bold">
                Batches
                <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-1.5 lg:-bottom-2 xl:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-1.5 lg:h-2 xl:h-2.5" />
              </span>
            </h2>
            <p className="text-gray-dark-80 text-xs sm:text-sm md:text-sm lg:text-sm font-semibold">
              Stay updated on upcoming batches, workshops, and webinars to boost your growth.
            </p>
          </div>
          <Link to="/courses" className="hidden sm:block text-xs sm:text-xs md:text-xs lg:text-sm bg-purple-gradient font-semibold text-white px-3 sm:px-2 md:px-3 lg:px-4 py-1.5 sm:py-1.5 md:py-2 lg:py-2 rounded-full hover:opacity-90 transition duration-300">
            View all courses
          </Link>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
          >
            {courses.map(course => (
              <div
                key={course.id}
                className={`px-1 sm:px-2 md:px-2.5 lg:px-2.5 xl:px-3 ${slidesPerView === 1 ? 'min-w-full' :
                  slidesPerView === 2 ? 'min-w-[50%]' :
                    'min-w-[33.33%]'
                  }`}
              >
                <BatchCard
                  course={course}
                  onClick={() => handleCardClick(course)}
                />
              </div>
            ))}
          </div>

          {courses.length > slidesPerView && (
            <>
              <div className='flex items-center gap-x-1 sm:gap-x-1.5 md:gap-x-2 lg:gap-x-2 justify-between mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8'>
                <button
                  onClick={prevSlide}
                  className="bg-white px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                  aria-label="Previous slide"
                >
                  <i className='icon icon-left_arrow text-black-0 font-bold text-xs sm:text-sm md:text-sm lg:text-base' />
                </button>
                <SlideIndicator
                  totalSlides={Math.max(0, courses.length - slidesPerView + 1)}
                  currentSlide={currentSlide}
                  onSlideClick={goToSlide}
                />
                <button
                  onClick={nextSlide}
                  className="bg-white px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6 py-1 sm:py-1.5 md:py-1.5 lg:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                  aria-label="Next slide"
                >
                  <i className='icon icon-right_arrow text-black-0 font-bold text-xs sm:text-sm md:text-sm lg:text-base' />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 text-center sm:hidden">
          <Link to="/courses" className="text-xs sm:text-sm md:text-sm font-semibold bg-purple-gradient text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:opacity-90 transition duration-300">
            View all batches
          </Link>
        </div>
      </div>
    </section>
  );
};

const FinalCTASection = () => {
  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-white font-jakarta">
      <div className="container mx-auto px-4 sm:px-5 md:px-8 lg:px-12 xl:px-20">
        <div className="bg-purple-gradient rounded-[20px] sm:rounded-[25px] md:rounded-[30px] lg:rounded-[35px] xl:rounded-[40px] pt-5 px-5 pb-12 sm:pt-6 sm:px-6 sm:pb-14 md:p-6 md:py-16 lg:p-7 lg:py-20 xl:p-8 xl:py-[100px] text-center text-white relative">
          <div className="absolute -bottom-0 sm:-bottom-8 md:-bottom-12 lg:-bottom-14 xl:-bottom-16 sm:left-1/2 sm:transform sm:-translate-x-1/2">
            <img src="/images/Pm mentor.svg" alt="Background" className="w-full h-full object-contain" />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-[27px] font-medium mb-4 sm:mb-4 md:mb-5 lg:mb-5">Land Your Dream Job in <span className="relative font-bold">
            Project Management
            <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1.5 sm:-bottom-2 md:-bottom-2 lg:-bottom-3 xl:-bottom-3 left-0 w-full h-1 sm:h-1.5 md:h-1.5 lg:h-2 xl:h-2.5" />
          </span></div>
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-white font-medium text-sm sm:text-base md:text-lg lg:text-xl leading-5 sm:leading-6">From beginner to certified project management expert — we've got you covered!</div>
          <Button variant="white" className="px-5 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-2.5 lg:px-6 lg:py-3 xl:py-3 !rounded-full bg-white text-black-0 font-semibold text-xs sm:text-sm md:text-sm lg:text-base">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses only once and use the same data for both sections
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses({ page: 1, limit: 10 });
      setCourses(response.data.courses || []);
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

  return (
    <Layout>
      <HeroSection />
      <PopularCoursesSection courses={courses} loading={loading} error={error} />
      <ProjectManagementBanner />
      <PopularFeaturesSection />
      <TestimonialsSection />
      <UpcomingBatchesSection courses={courses} loading={loading} error={error} />
      <FinalCTASection />
      <img src="/images/pm.png" alt="Background" className="w-24 h-24 bg-transparent object-contain fixed top-[90%] right-2 sm:right-10 -translate-y-1/2 z-10" />
    </Layout>
  );
};

export default HomePage;
