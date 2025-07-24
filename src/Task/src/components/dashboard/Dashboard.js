import React, { useEffect, useState, useRef } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiGrid,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTimeBasedGreeting, formatDate } from '../../utils/helpers';
import { useUser } from '../../context/UserContext';
import dashboardService from '../../services/api/dashboardService';
import batchCalendarService from '../../services/api/batchCalendarService';
import MyCalendar from '../calendar/MyCalendar';
import EventPopover from '../calendar/EventPopover';
import DashboardBatchCourseCard from './DashboardBatchCourseCard';
import Streakpad from '../calendar/Streakpad';
import { leaderboardData } from '../../utils/constant';
import SlideIndicator from '../common/SlideIndicator';

const StatsCard = ({ icon, title, value, color, subtitle, progressValue, gradientClass }) => {
  return (
    <div className={`rounded-[15px] shadow-sm h-147px border border-gray-light-D3 flex-1 ${color} transition-all duration-300 hover:shadow-md animate-fade-in overflow-hidden min-w-[240px] md:min-w-0`}>
      <div className={`h-50px w-full ${gradientClass || 'bg-orange-gradient'}`}></div>
      {progressValue && <div className="text-sm absolute right-5 top-4 text-black-0 font-bold">{title}</div>}
      <div className="p-5">
        {icon}
        {!progressValue && (
          <div className="flex items-center">
            <div className="flex justify-between items-center w-full mt-6">
              <div>
                <p className="text-sm text-black-0 font-bold">{title}</p>
                {subtitle && <p className="text-[10px] text-gray-dark-200">{subtitle}</p>}
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        )}
      </div>
      {progressValue !== undefined && (
        <div className="px-5 flex items-center justify-between mt-2 gap-5">
          <div className="bg-gray-200 rounded-full h-5 overflow-hiddenp w-full">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
          <div className="flex text-xl font-bold text-black-0 justify-between items-center">{progressValue}</div>
        </div>
      )}
    </div>
  );
};

const LeaderboardItem = ({ position, name, score, avatar, isYou }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard/profile');
  };

  return (
    <div
      className={`${isYou ? 'bg-purple-gradient-light border border-t-purple-light border-l-purple-light border-r-purple-light' : 'bg-gray-dark-F6'} rounded-[15px] p-2 sm:p-4 relative cursor-pointer transition-transform sm:hover:scale-105 hover:shadow-md`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="text-sm font-bold text-black-0 bg-white p-2 w-8 rounded-full">{position}</div>
        <div className="ml-2 sm:ml-4">
          <h4 className="font-bold text-black-0 text-sm sm:text-base">{name}</h4>
          <p className="text-[11px] sm:text-xs text-gray-dark-80 font-medium mt-1">{score}</p>
        </div>
        <div className="ml-auto">
          <div className="relative">
            <img src="/images/leaderboader_profile_bg.svg" alt="Profile background" className="w-16 h-16" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full  overflow-hidden">
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Lumies = () => {
  const lumiesData = [
    {
      id: 1,
      title: 'Why are public sector leaders cautious about',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      timeAgo: '1 Month ago',
      stubs: 7,
      quizzes: 5
    },
    {
      id: 2,
      title: 'Why are public sector leaders cautious about',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      timeAgo: '1 Month ago',
      stubs: 7,
      quizzes: 5
    },
    {
      id: 3,
      title: 'What are key practise for icofr implementation?',
      image: null,
      timeAgo: '1 Month ago',
      content: 'Auditors must assess and report on deficiencies in internal controls, with annual reports on control effectiveness submitted to the sca and certification by the ceo/cfo on controls\' adequacy.',
      stubs: 7,
      quizzes: 5
    },
    {
      id: 4,
      title: 'What are key practise for icofr implementation?',
      image: null,
      timeAgo: '1 Month ago',
      content: 'Auditors must assess and report on deficiencies in internal controls, with annual reports on control effectiveness submitted to the sca and certification by the ceo/cfo on controls\' adequacy.',
      stubs: 7,
      quizzes: 5
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3" style={{ display: 'none' }}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Lumies (Microlessons)</h3>
        <div className="flex space-x-2">
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lumiesData.map((lumie) => (
            <div key={lumie.id} className="bg-white border p-5 border-gray-light-D3 rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all">
              {lumie.image ? (
                <div className="relative">
                  <img src={lumie.image} alt={lumie.title} className="w-full h-[100px] object-cover rounded-lg" />

                  <div className="flex items-center mb-3 mt-5">
                    <div className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full flex items-center">
                      <span className="mr-1">1</span>
                      <span>Month ago</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium mb-3 group-hover:text-purple-light transition-colors text-black-0">
                    {lumie.title}
                  </h4>
                </div>
              ) : (
                <div className="">
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full flex items-center">
                      <span className="mr-1">1</span>
                      <span>Month ago</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium mb-3 group-hover:text-purple-light transition-colors text-black-0">
                    {lumie.title}
                  </h4>
                  {lumie.content && (
                    <p className="text-xs text-gray-dark-200 mb-3 line-clamp-3">
                      {lumie.content}
                    </p>
                  )}
                </div>
              )}

              <div className={`${!lumie.image ? 'pt-0' : ''}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-x-2">
                    <div className="flex items-center text-xs text-gray-dark-80 font-medium">
                      <span>{lumie.stubs} Stubs</span>
                    </div>
                    <div className="h-3 w-px bg-gray-300 mx-1"></div>
                    <div className="flex items-center text-xs text-gray-dark-80 font-medium">
                      <span>{lumie.quizzes} Quizzes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <div className="p-2 rounded-full bg-orange-gradient-light flex items-center justify-center">
                      <img src="/images/logo.svg" alt="Logo" className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-black-0 font-medium">0</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Videos = () => {
  const videosData = [
    {
      id: 1,
      title: 'Is frequent real estate trading a business or investment?',
      thumbnail: 'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      duration: '0:00/4:01',
      hasControls: false
    },
    {
      id: 2,
      title: 'What transforms digital marketing practices?',
      thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      duration: '0:00/4:01',
      hasControls: true
    },
    {
      id: 3,
      title: 'What transforms digital marketing practices?',
      thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      duration: '0:00/4:01',
      hasControls: true
    },
    {
      id: 4,
      title: 'What transforms digital marketing practices?',
      thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      duration: '0:00/4:01',
      hasControls: true
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in mb-6" style={{ display: 'none' }}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Videos / Podcasts</h3>
        <div className="flex space-x-2">
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {videosData.map((video) => (
            <div key={video.id} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all">
              {!video.hasControls ? (
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-[120px] object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-70 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-[120px] object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <div className="flex items-center justify-between">
                      <button className="bg-orange-500 rounded-full p-1.5 text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                      <div className="flex items-center space-x-1.5">
                        <div className="relative w-24 h-1 bg-gray-300 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full w-1/3"></div>
                        </div>
                        <span className="text-xs text-white font-medium">{video.duration}</span>
                        <button className="text-white p-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 01-7.072 0m9.9 2.828a9 9 0 01-12.728 0"></path>
                          </svg>
                        </button>
                        <button className="text-white p-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h4 className="text-sm font-medium mb-0 group-hover:text-purple-light transition-colors line-clamp-2">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LeaderboardSection = ({ data }) => {

  return (
    <div className="bg-white mx-6 sm:mx-0 rounded-[15px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3">
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-black-0">Leaderboard</h3>
      </div>
      <div className="py-4 px-4 sm:p-4">
        <div className="grid lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-4">
          {data.map((item) => (
            <LeaderboardItem
              key={item.id}
              position={item.position}
              name={item.name}
              score={item.score}
              avatar={item.avatar}
              isYou={item.isYou}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

const UpcomingBatchesSection = ({ batches }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    if (currentSlide < batches.length - slidesPerView) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(Math.max(0, batches.length - slidesPerView));
    }
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
    if (sliderRef.current && batches.length > 0) {
      const slideWidth = 100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
  }, [currentSlide, slidesPerView, batches.length]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 mb-8 mx-6 sm:mx-0">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-bold text-black-0">Upcoming Batches</h3>
        <div className="hidden lg:flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FiChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FiChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {batches.length > 0 ? (
          <>
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {batches.map((batch) => {
                const courseData = {
                  id: batch.course.id,
                  title: batch.course.title,
                  description: batch.course.description || batch.description,
                  lessons: batch.course.lessons_count,
                  duration: batch.course.duration_weeks,
                  instructors: batch.tutors.map(tutor => tutor.name),
                  date: new Date(batch.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }),
                  time: new Date(batch.start_date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }),
                  tutors: batch.tutors.map(tutor => tutor.name),
                  course_image: batch.course.course_image,
                  joining_url: batch.joining_url,
                  level: batch.course.level
                };

                return (
                  <DashboardBatchCourseCard key={batch.id} course={courseData} />
                );
              })}
            </div>

            <div className="lg:hidden">
              <div className="relative overflow-hidden">
                <div
                  ref={sliderRef}
                  className="flex transition-transform duration-500 ease-in-out"
                >
                  {batches.map(batch => {
                    const courseData = {
                      id: batch.course.id,
                      title: batch.course.title,
                      description: batch.course.description || batch.description,
                      lessons: batch.course.lessons_count,
                      duration: batch.course.duration_weeks,
                      instructors: batch.tutors.map(tutor => tutor.name),
                      date: new Date(batch.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }),
                      time: new Date(batch.start_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }),
                      tutors: batch.tutors.map(tutor => tutor.name),
                      course_image: batch.course.course_image,
                      joining_url: batch.joining_url,
                      level: batch.course.level
                    };

                    return (
                      <div
                        key={batch.id}
                        className={`sm:px-2 px-0 ${slidesPerView === 1 ? 'min-w-full' :
                          slidesPerView === 2 ? 'min-w-[50%]' :
                            'min-w-[33.33%]'
                          }`}
                      >
                        <DashboardBatchCourseCard course={courseData} />
                      </div>
                    );
                  })}
                </div>

                {batches.length > slidesPerView && (
                  <>
                    <div className='flex items-center gap-x-2 justify-between mt-4'>
                      <button
                        onClick={prevSlide}
                        className="bg-white px-4 py-1 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                        aria-label="Previous slide"
                      >
                        <i className='icon icon-left_arrow text-black-0 font-bold text-sm' />
                      </button>
                      <SlideIndicator
                        totalSlides={Math.max(0, batches.length - slidesPerView + 1)}
                        currentSlide={currentSlide}
                        onSlideClick={(index) => setCurrentSlide(index)}
                      />  
                      <button
                        onClick={nextSlide}
                        className="bg-white px-4 py-1 rounded-full border border-[#E3E3E3] z-10 hover:bg-gray-100"
                        aria-label="Next slide"
                      >
                        <i className='icon icon-right_arrow text-black-0 font-bold text-sm' />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FiAlertCircle className="text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming batches</h3>
            <p className="text-gray-500">You don't have any upcoming batches scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: dashboardService.getDashboardOverview,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: calendarData,
    isLoading: isCalendarLoading,
    isError: isCalendarError,
  } = useQuery({
    queryKey: ['dashboardBatchCalendar', currentCalendarDate.getFullYear()],
    queryFn: () => batchCalendarService.getPurchasedBatches({
      year: currentCalendarDate.getFullYear(),
      view: 'year'
    }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setGreeting(getTimeBasedGreeting());

    const intervalId = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const upcomingBatches = dashboardData?.data?.upcoming_batches || [];
  const calendarEvents = dashboardData?.data?.calendar_events || [];
  const hasActiveAddons = dashboardData?.data?.active_addons?.length > 0;
  const batchesData = calendarData?.data?.batches || [];

  const getEventsForDate = (date) => {
    if (!batchesData || batchesData.length === 0) return [];

    const targetDateString = date.toDateString();

    return batchesData.filter(batch => {
      const startDate = new Date(batch.start_date || batch.start);
      return startDate.toDateString() === targetDateString;
    }).map(batch => ({
      id: batch.id,
      title: batch.title || batch.course?.title,
      name: batch.name,
      startDate: new Date(batch.start_date || batch.start),
      endDate: new Date(batch.end_date || batch.end),
      course: batch.course,
      tutors: batch.tutors,
      joiningUrl: batch.joining_url,
      description: batch.description
    }));
  };

  const getMonthsWithData = () => {
    if (!batchesData || batchesData.length === 0) return [];

    const monthsWithData = new Set();

    batchesData.forEach(batch => {
      const startDate = new Date(batch.start_date || batch.start);
      const monthKey = `${startDate.getFullYear()}-${startDate.getMonth()}`;
      monthsWithData.add(monthKey);
    });

    return Array.from(monthsWithData).map(monthKey => {
      const [year, month] = monthKey.split('-').map(Number);
      return new Date(year, month, 1);
    }).sort((a, b) => a - b);
  };

  const handleDateClick = (date, events, element) => {
    const dateEvents = getEventsForDate(date);

    if (dateEvents && dateEvents.length > 0) {
      setSelectedEvent({
        date: date,
        batches: dateEvents,
      });

      setShowPopover(true);
    } else {
      setShowPopover(false);
    }
  };

  const currentDate = formatDate(new Date());

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-light mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-medium text-gray-900 mt-4">Failed to load dashboard</h3>
          <p className="mt-2 text-gray-600">{error?.response?.data?.message || error?.message || 'Something went wrong'}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-purple-light text-white rounded-md hover:bg-purple-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-4 pb-10 overflow-auto space-y-6 bg-gray-light-300">
      <div className="sm:bg-white rounded-lg sm:shadow-sm overflow-hidden animate-fade-in sm:border border-gray-light-D3">
        <div className="px-6 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black-0">{greeting}, {user?.name}</h1>
              <p className="text-gray-dark-200 text-xs sm:text-sm mt-1.5">{currentDate}</p>
            </div>
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

        <div className="px-6 sm:px-6 sm:py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard
              icon={<div className="w-10 h-10 rounded-full bg-orange-gradient   flex items-center justify-center absolute top-7 text-white">
                <FiGrid className="w-5 h-5" />
              </div>}
              title="XPs"
              value="0"
              color="bg-white"
              gradientClass="bg-orange-gradient-light"
            />
            <StatsCard
              icon={<div className="w-10 h-10 rounded-full bg-purple-gradient flex items-center justify-center absolute top-7 text-white">
                <FiCheckCircle className="w-5 h-5" />
              </div>}
              title="Lumies completed"
              value="0"
              subtitle="Jul 27, 2024 - Till Date"
              color="bg-white"
              gradientClass="bg-purple-gradient-light"
            />
            <StatsCard
              icon={<div className="w-10 h-10 rounded-full bg-orange-gradient flex items-center justify-center absolute top-7 text-white">
                <FiClock className="w-5 h-5" />
              </div>}
              title="Lumies pending"
              value="13"
              subtitle="Complete these lumies to improve your rank"
              color="bg-white"
              gradientClass="bg-orange-gradient-light"
            />
            <StatsCard
              icon={<div className="w-10 h-10 rounded-full bg-purple-gradient flex items-center justify-center absolute top-7 text-white">
                <FiClock className="w-5 h-5" />
              </div>}
              title="Current streak"
              value="0"
              progressValue={20}
              color="bg-white"
              gradientClass="bg-purple-gradient-light"
            />
          </div>

        </div>
      </div>

      <LeaderboardSection data={leaderboardData} />

      <div >
        <Streakpad />
      </div>

      <UpcomingBatchesSection batches={upcomingBatches} />

      {(batchesData.length > 0 || (hasActiveAddons && calendarEvents.length > 0)) && (
        <MyCalendar
          events={calendarEvents}
          batchesData={batchesData}
          getEventsForDate={getEventsForDate}
          getMonthsWithData={getMonthsWithData}
          onDateClick={handleDateClick}
          currentCalendarDate={currentCalendarDate}
          setCurrentCalendarDate={setCurrentCalendarDate}
          isLoading={isCalendarLoading}
          isError={isCalendarError}
        />
      )}

      <Lumies />

      <Videos />

      {showPopover && selectedEvent && (
        <EventPopover
          event={selectedEvent}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;