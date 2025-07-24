import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, parseISO } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MyCalendar = ({
  events = [],
  batchesData = [],
  getEventsForDate,
  getMonthsWithData,
  onDateClick,
  currentCalendarDate,
  setCurrentCalendarDate,
  isLoading = false,
  isError = false
}) => {
  const [months, setMonths] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    if (currentSlide < months.length - slidesPerView) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(Math.max(0, months.length - slidesPerView));
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
    if (sliderRef.current && months.length > 0) {
      const slideWidth = 100 / slidesPerView;
      sliderRef.current.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
  }, [currentSlide, slidesPerView, months.length]);


  const isLegacyMode = !batchesData.length && events.length > 0;

  useEffect(() => {
    if (isLegacyMode) {
      generateLegacyMonths();
    } else if (getMonthsWithData) {
      const monthsWithData = getMonthsWithData();
      setAvailableMonths(monthsWithData);

      if (monthsWithData.length > 0) {
        const monthsToShow = monthsWithData.slice(0, 4);
        generateBatchMonths(monthsToShow);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchesData, events, currentCalendarDate, isLegacyMode]);

  const generateLegacyMonths = () => {
    const result = [];
    const baseDate = currentCalendarDate || new Date();

    for (let i = 0; i < 4; i++) {
      const monthDate = new Date(baseDate);
      monthDate.setMonth(baseDate.getMonth() + i);

      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const daysInMonth = eachDayOfInterval({ start, end });

      const firstDayOfWeek = start.getDay();

      const days = [];
      for (let j = 0; j < firstDayOfWeek; j++) {
        days.push({ day: null, isCurrentMonth: false });
      }

      daysInMonth.forEach(date => {
        const day = date.getDate();
        const hasEvent = events.some(event => {
          const eventDate = parseISO(event.start);
          return isSameDay(eventDate, date);
        });

        days.push({
          day,
          date,
          isCurrentMonth: true,
          isToday: isToday(date),
          hasEvent
        });
      });

      const totalSlots = 42;
      const remainingSlots = totalSlots - days.length;
      for (let j = 1; j <= remainingSlots; j++) {
        days.push({ day: j, isCurrentMonth: false });
      }

      result.push({
        month: format(monthDate, 'MMMM'),
        year: format(monthDate, 'yyyy'),
        days
      });
    }
    setMonths(result);
  };

  const generateBatchMonths = (monthDates) => {
    const result = [];

    monthDates.forEach(monthDate => {
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const daysInMonth = eachDayOfInterval({ start, end });

      const firstDayOfWeek = start.getDay();

      const days = [];
      for (let j = 0; j < firstDayOfWeek; j++) {
        days.push({ day: null, isCurrentMonth: false });
      }

      daysInMonth.forEach(date => {
        const day = date.getDate();
        const dateEvents = getEventsForDate ? getEventsForDate(date) : [];
        const hasEvent = dateEvents.length > 0;

        days.push({
          day,
          date,
          isCurrentMonth: true,
          isToday: isToday(date),
          hasEvent,
          events: dateEvents
        });
      });

      const totalSlots = 42;
      const remainingSlots = totalSlots - days.length;
      for (let j = 1; j <= remainingSlots; j++) {
        days.push({ day: j, isCurrentMonth: false });
      }

      result.push({
        month: format(monthDate, 'MMMM'),
        year: format(monthDate, 'yyyy'),
        days
      });
    });

    setMonths(result);
  };

  const nextMonth = () => {
    if (isLegacyMode) {
      const nextDate = new Date(currentCalendarDate || new Date());
      nextDate.setMonth(nextDate.getMonth() + 1);
      if (setCurrentCalendarDate) {
        setCurrentCalendarDate(nextDate);
      }
    } else {
      const newIndex = Math.min(currentIndex + 4, availableMonths.length - 4);
      if (newIndex !== currentIndex && newIndex >= 0) {
        setCurrentIndex(newIndex);
        const monthsToShow = availableMonths.slice(newIndex, newIndex + 4);
        generateBatchMonths(monthsToShow);
      }
    }
  };

  const prevMonth = () => {
    if (isLegacyMode) {
      const prevDate = new Date(currentCalendarDate || new Date());
      prevDate.setMonth(prevDate.getMonth() - 1);
      if (setCurrentCalendarDate) {
        setCurrentCalendarDate(prevDate);
      }
    } else {
      const newIndex = Math.max(currentIndex - 4, 0);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        const monthsToShow = availableMonths.slice(newIndex, newIndex + 4);
        generateBatchMonths(monthsToShow);
      }
    }
  };

  const canGoNext = isLegacyMode || (currentIndex + 4 < availableMonths.length);
  const canGoPrev = isLegacyMode || (currentIndex > 0);

  const handleDayClick = (day) => {
    if (day.isCurrentMonth && day.date && onDateClick) {
      onDateClick(day.date, day.events || [], null);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-light-D3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">My Calendar</h3>
        </div>
        <div className="p-4 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading calendar...</span>
        </div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-light-D3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">My Calendar</h3>
        </div>
        <div className="p-4 flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load calendar data</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-light-D3 mx-6 sm:mx-0 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-semibold">My Calendar</h3>
        {(canGoNext || canGoPrev) && (
          <div className="flex space-x-2">
            {canGoPrev && (
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
            )}
            {canGoNext && (
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {months.map((calendar, index) => (
            <div key={index} className="p-3 border border-gray-light-D3 rounded-lg">
              <div className="text-center mb-4 bg-orange-gradient-light py-2 rounded-xl text-sm font-bold text-black-0">
                {calendar.month} {calendar.year}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="text-center text-sm font-medium h-6 w-8">
                    {day}
                  </div>
                ))}
                {calendar.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    onClick={() => handleDayClick(day)}
                    className={`text-center p-0.5 h-8 w-8 ${!day.day ? 'text-transparent' :
                      !day.isCurrentMonth ? 'text-gray-dark-80 font-medium' :
                        day.isToday ? 'bg-purple-light text-white rounded-full font-medium cursor-pointer' :
                          day.hasEvent ? 'bg-purple-100 text-purple-light rounded-full font-medium cursor-pointer hover:bg-purple-200 transition-colors' :
                            'text-black-0 font-medium cursor-pointer hover:bg-gray-100 rounded-full transition-colors'
                      }`}
                  >
                    <span className="text-xs">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="sm:hidden">
          <div className="relative overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
            >
              {months.map((calendar, index) => (
                <div key={index}
                  className={`p-3 border border-gray-light-D3 rounded-lg ${slidesPerView === 1 ? 'min-w-full' :
                    slidesPerView === 2 ? 'min-w-[50%]' :
                      'min-w-[33.33%]'
                    }`}>
                  <div className="text-center mb-4 bg-orange-gradient-light py-2 rounded-xl text-sm font-bold text-black-0 flex gap-2 items-center justify-center">
                    {months.length > slidesPerView && (
                      <div onClick={prevSlide} className='bg-orange-gradient rounded-full  w-5 h-5 flex items-center justify-center'>
                        <i className='icon icon-greater text-white text-[10px]' />
                      </div>
                    )}
                    {calendar.month} {calendar.year}
                    {months.length > slidesPerView && (
                      <div onClick={nextSlide} className='bg-orange-gradient rounded-full  w-5 h-5 flex items-center justify-center'>
                        <i className='icon icon-greater text-white text-[10px]' />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, dayIndex) => (
                      <div key={dayIndex} className="text-center text-sm font-medium h-6 w-8">
                        {day}
                      </div>
                    ))}
                    {calendar.days.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        onClick={() => handleDayClick(day)}
                        className={`text-center p-0.5 h-8 w-8 ${!day.day ? 'text-transparent' :
                          !day.isCurrentMonth ? 'text-gray-dark-80 font-medium' :
                            day.isToday ? 'bg-purple-light text-white rounded-full font-medium cursor-pointer' :
                              day.hasEvent ? 'bg-purple-100 text-purple-light rounded-full font-medium cursor-pointer hover:bg-purple-200 transition-colors' :
                                'text-black-0 font-medium cursor-pointer hover:bg-gray-100 rounded-full transition-colors'
                          }`}
                      >
                        <span className="text-xs">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyCalendar; 