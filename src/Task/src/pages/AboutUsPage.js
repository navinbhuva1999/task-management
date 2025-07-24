import React, { useState, useEffect, useRef } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { empowerCards, learnWithUs } from '../utils/constant';
import SlideIndicator from '../components/common/SlideIndicator';

const AboutUsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const maxSlides = 3;
  const carouselRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === maxSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? maxSlides - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };



  const LearnWithUsSection = () => {
    const [currentSlideCourse, setCurrentSlideCourse] = useState(0);
    const [slidesPerViewCourse, setSlidesPerViewCourse] = useState(3);
    const sliderRefCourse = useRef(null);

    const nextSlideCourse = () => {
      if (currentSlideCourse < learnWithUs.length - slidesPerViewCourse) {
        setCurrentSlideCourse(currentSlideCourse + 1);
      } else {
        setCurrentSlideCourse(0);
      }
    };

    const prevSlideCourse = () => {
      if (currentSlideCourse > 0) {
        setCurrentSlideCourse(currentSlideCourse - 1);
      } else {
        setCurrentSlideCourse(Math.max(0, learnWithUs.length - slidesPerViewCourse));
      }
    };

    const goToSlideCourse = (index) => {
      setCurrentSlideCourse(index);
    };

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 640) {
          setSlidesPerViewCourse(1);
        } else if (window.innerWidth < 1024) {
          setSlidesPerViewCourse(2);
        } else {
          setSlidesPerViewCourse(3);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      if (sliderRefCourse.current && learnWithUs.length > 0) {
        const slideWidth = 100 / slidesPerViewCourse;
        sliderRefCourse.current.style.transform = `translateX(-${currentSlideCourse * slideWidth}%)`;
      }
    }, [currentSlideCourse, slidesPerViewCourse]);


    return (
      <section className="py-12 sm:py-16 bg-gray-light-F8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-[27px] font-normal mb-2 sm:mb-4 text-black-0">
              Why Learn With Our <span className="relative font-semibold">
                Courses?
                <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1.5 sm:h-2.5" />
              </span>
            </h2>
            <p className="text-gray-dark-80 text-xs sm:text-sm font-semibold mt-2">Careers with practical, recognized, and flexible project training</p>
          </div>

          <div className="relative overflow-hidden">
            <div
              ref={sliderRefCourse}
              className="flex transition-transform duration-500 ease-in-out"
            >
              {learnWithUs.map((item) => (
                <div
                  key={item.id}
                  className={`px-0 sm:px-3 ${slidesPerViewCourse === 1 ? 'min-w-full' :
                    slidesPerViewCourse === 2 ? 'min-w-[50%]' :
                      'min-w-[33.33%]'
                    }`}
                >
                  <m.div
                    variants={fadeInUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-lg sm:rounded-18px border border-gray-light-D3 overflow-hidden shadow-sm"
                  >
                    <div className="h-40 sm:h-52 overflow-hidden p-3 sm:p-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                        loading="lazy"
                      />
                    </div>
                    <div className="pb-3 sm:pb-4 px-3 sm:px-4">
                      <h3 className="text-base sm:text-lg font-semibold text-black-0 mb-2 sm:mb-3 text-center">{item.title}</h3>
                      <div className="text-gray-dark-80 text-xs sm:text-sm font-semibold text-center !leading-[20px] sm:!leading-[24px]">
                        {item.description}
                      </div>
                    </div>
                  </m.div>
                </div>
              ))}
            </div>
            {learnWithUs.length > slidesPerViewCourse && (
              <>
                <div className='flex items-center gap-x-2 justify-between mt-6 sm:mt-8'>
                  <button
                    onClick={prevSlideCourse}
                    className="bg-white px-4 sm:px-6 py-1 sm:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                    aria-label="Previous slide"
                  >
                    <i className='icon icon-left_arrow text-black-0 font-bold text-sm sm:text-base' />
                  </button>
                    <SlideIndicator
                      totalSlides={Math.max(0, learnWithUs.length - slidesPerViewCourse + 1)}
                      currentSlide={currentSlideCourse}
                      onSlideClick={goToSlideCourse}
                    />
                  <button
                    onClick={nextSlideCourse}
                    className="bg-white px-4 sm:px-6 py-1 sm:py-2 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
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
    )
  }


  return (
    <LazyMotion features={domAnimation}>
      <Layout>
        <section className="relative bg-gray-50 py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-4 text-black-0 text-center">
                About <span className="relative font-bold">
                  Us
                  <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1.5 sm:h-2.5" />
                </span>
              </h1>
              <m.p
                className="text-gray-dark-80 font-semibold leading-7 max-w-[18rem] sm:max-w-2xl mx-auto mb-6 sm:mb-3 text-sm sm:text-base px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Empowering project leaders, driving career success.
              </m.p>

              <m.div
                className="flex items-center justify-center mt-4 text-xs sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link to="/" className="flex items-center text-black-0">
                  <div className="p-1.5 sm:p-2 rounded-full bg-purple-gradient flex items-center justify-center mr-1.5 sm:mr-2">
                    <i className='icon icon-home text-white text-base sm:text-xl' />
                  </div>
                  <span>Home</span>
                </Link>
                <i className="icon icon-greater text-black-0 text-xs mx-2 sm:mx-4"></i>
                <Link to="/about-us" className="text-black-0 font-bold">About Us</Link>
              </m.div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-6 sm:px-6 lg:px-20">
            <m.div
              className="rounded-lg sm:rounded-2xl overflow-hidden mb-4 sm:mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/brainstorm-meeting.svg"
                alt="Project management team brainstorming"
                className="w-full h-auto object-cover rounded-lg sm:rounded-2xl"
                loading="lazy"
                onLoad={(e) => {
                  e.target.classList.add('loaded');
                }}
                style={{
                  opacity: 0,
                  transition: 'opacity 0.5s ease-in-out',
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Project+Management+Team';
                }}
              />
            </m.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start mb-4 sm:mb-10">
              <m.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-base sm:text-2xl md:text-3xl !leading-[28px] sm:!leading-[36px] md:!leading-[40px] text-black-0 font-bold mb-4 sm:mb-8">
                  Empowering Project Leaders With Globally Recognized Certifications And Practical Expertise
                </div>
                <m.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-purple-gradient text-white px-6 py-2 sm:py-3 font-medium !rounded-full hover:bg-purple-dark transition-colors text-sm sm:text-base"
                >
                  Start learning
                </m.button>
              </m.div>

              <m.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-gray-dark-80 font-medium text-sm sm:text-base !leading-[22px] sm:!leading-[28px]">
                    At pm mentors, we believe that great projects are driven by great leaders. Our mission is to equip professionals with the skills, knowledge, and confidence to excel in project management, no matter the industry or scale.
                  </div>

                  <div className="text-gray-dark-80 font-medium text-sm sm:text-base !leading-[22px] sm:!leading-[28px]">
                    As an authorized training partner (atp) of the project management institute (pmi), we are certified to provide globally recognized certifications that shape careers and transform organizations.
                  </div>

                  <div className="text-gray-dark-80 font-medium text-sm sm:text-base !leading-[22px] sm:!leading-[28px]">
                    From beginner to expert, from classroom to boardroom, pm mentors is with you at every step of your professional development.
                  </div>
                </div>
              </m.div>
            </div>
          </div>
        </section>

        <LearnWithUsSection />

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
              <m.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-4 sm:mb-0"
              >
                <h2 className="text-xl sm:text-2xl lg:text-[27px] font-normal mb-2 sm:mb-4 text-black-0">
                  Who We <span className="relative font-semibold">
                    Empower
                    <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1.5 sm:h-2.5" />
                  </span>
                </h2>
                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-gray-dark-80 text-xs sm:text-sm font-semibold mt-2"
                >
                  Supporting professionals to achieve project success across industries worldwide.
                </m.p>
              </m.h2>
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={prevSlide}
                  className="bg-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#E3E3E3] hover:bg-gray-100 transition-colors"
                  aria-label="Previous slide"
                >
                  <i className="icon icon-left_arrow text-black-0 text-sm sm:text-base"></i>
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#E3E3E3] hover:bg-gray-100 transition-colors"
                  aria-label="Next slide"
                >
                  <i className="icon icon-right_arrow text-black-0 text-sm sm:text-base"></i>
                </button>
              </div>
            </div>

            <div className="hidden sm:block">
              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {empowerCards.map((card) => (
                  <m.div
                    key={card.id}
                    variants={fadeInUpVariants}
                    className="bg-white rounded-lg sm:rounded-18px border border-gray-light-D3 overflow-hidden shadow-sm"
                  >
                    <div className="h-40 sm:h-52 overflow-hidden p-3 sm:p-4">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                        loading="lazy"
                        onLoad={(e) => {
                          e.target.classList.add('loaded');
                        }}
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.5s ease-in-out',
                        }}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x300?text=${card.title}`;
                        }}
                      />
                    </div>
                    <div className="pb-3 sm:pb-4 px-3 sm:px-4">
                      <h3 className="text-base sm:text-lg font-semibold text-black-0 mb-2 sm:mb-3 text-center">{card.title}</h3>
                      <div className="text-gray-dark-80 text-xs sm:text-sm font-semibold text-center !leading-[20px] sm:!leading-[24px]">{card.description}</div>
                    </div>
                  </m.div>
                ))}
              </m.div>
            </div>

            <div className="sm:hidden relative overflow-hidden" ref={carouselRef}>
              <m.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg border border-gray-light-D3 overflow-hidden shadow-sm"
              >
                <div className="h-40 overflow-hidden p-3">
                  <img
                    src={empowerCards[currentSlide].image}
                    alt={empowerCards[currentSlide].title}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    onLoad={(e) => {
                      e.target.classList.add('loaded');
                    }}
                    style={{
                      opacity: 0,
                      transition: 'opacity 0.5s ease-in-out',
                    }}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300?text=${empowerCards[currentSlide].title}`;
                    }}
                  />
                </div>
                <div className="pb-3 px-3">
                  <h3 className="text-base font-semibold text-black-0 mb-2 text-center">{empowerCards[currentSlide].title}</h3>
                  <div className="text-gray-dark-80 text-xs font-semibold text-center !leading-[20px]">{empowerCards[currentSlide].description}</div>
                </div>
              </m.div>

              <div className="flex justify-center mt-4 gap-1">
                {empowerCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 w-1.5 mx-1 rounded-full transition-all ${currentSlide === index ? 'bg-purple-light h-2 w-2' : 'bg-gray-300'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-20">
            <div className="bg-purple-gradient rounded-[30px] sm:rounded-[40px] pt-6 px-6 pb-14 sm:p-8 md:py-[100px] text-center text-white relative">
              <div className="absolute -bottom-3 sm:-bottom-16 sm:left-1/2 sm:transform sm:-translate-x-1/2">
                <img src="/images/Pm mentor.svg" alt="Background" className="w-full h-full object-contain" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-[27px] font-medium mb-6 sm:mb-4">
                Ready To Take The Next Step In Your Career?
              </div>
              <div className="mb-8 sm:mb-12 text-white font-medium text-sm sm:text-xl">
                Start your journey with PM Mentors today.
              </div>
              <Button variant="white" className="px-4 sm:px-6 py-2 sm:py-3 !rounded-full bg-white text-black-0 font-semibold text-sm sm:text-base">
                Explore our courses
              </Button>
            </div>
          </div>
        </section>
      </Layout>

      <style jsx global>{`
        img.loaded {
          opacity: 1 !important;
        }
      `}</style>
    </LazyMotion>
  );
};

export default AboutUsPage; 