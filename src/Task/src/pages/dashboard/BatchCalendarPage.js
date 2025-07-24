import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import MonthCalendar from '../../components/calendar/MonthCalendar';
import YearCalendar from '../../components/calendar/YearCalendar';
import EventPopover from '../../components/calendar/EventPopover';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import batchCalendarService from '../../services/api/batchCalendarService';

const BatchCalendarPage = () => {
  const [viewMode, setViewMode] = useState('year');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPopover, setShowPopover] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [batchesData, setBatchesData] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const getApiParams = () => {
    const params = {
      year: currentYear,
      view: viewMode
    };

    if (viewMode === 'month') {
      params.month = currentDate.getMonth() + 1;
    }

    return params;
  };

  const {
    data: calendarData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['batchCalendar', currentYear, currentDate.getMonth() + 1, viewMode],
    queryFn: () => batchCalendarService.getPurchasedBatches(getApiParams()),
    onSuccess: (data) => {
      setBatchesData(data?.data?.batches || []);
    },
    onError: (error) => {
      setBatchesData([]);
    }
  });

  useEffect(() => {
    if (calendarData?.data?.batches) {
      setBatchesData(calendarData.data.batches);
    }
  }, [calendarData]);

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    setShowPopover(false);
  };

  const getEventsForDate = (date) => {
    if (!batchesData || batchesData.length === 0) return [];

    const targetDateString = date.toDateString();

    return batchesData.filter(batch => {
      const startDate = new Date(batch.start_date);
      return startDate.toDateString() === targetDateString;
    }).map(batch => ({
      id: batch.id,
      title: batch.course.title,
      name: batch.name,
      startDate: new Date(batch.start_date),
      endDate: new Date(batch.end_date),
      course: batch.course,
      tutors: batch.tutors,
      joiningUrl: batch.joining_url,
      description: batch.description
    }));
  };

  const getHighlightedMonths = () => {
    if (!batchesData || batchesData.length === 0) return [];

    const highlightedMonths = new Set();

    batchesData.forEach(batch => {
      const startDate = new Date(batch.start_date);

      if (startDate.getFullYear() === currentYear) {
        highlightedMonths.add(startDate.getMonth());
      }
    });

    return Array.from(highlightedMonths);
  };

  const handleDateClick = (date, events, element) => {
    const dateEvents = getEventsForDate(date);

    if (dateEvents && dateEvents.length > 0) {
      setSelectedEvent({
        date: date,
        batches: dateEvents,
        allEvents: dateEvents
      });

      setShowPopover(true);
    } else {
      setShowPopover(false);
      setSelectedEvent(null);
    }
  };

  const handleMonthClick = (monthIndex) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    setCurrentDate(newDate);
    setViewMode('month');
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  return (
    <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300 animate-fade-in">
      <div className="sm:bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in sm:border border-gray-light-D3 mx-4">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black-0">Batch Calendar</h1>
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

        <div className="p-3 sm:p-5 m-3 bg-white sm:m-5 border border-gray-light-D3 rounded-18px">
          {isLoading && (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600 text-sm">Loading calendar...</span>
            </div>
          )}

          {isError && (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="text-center">
                <p className="text-red-500 mb-2 text-sm">Failed to load calendar data</p>
                <button
                  onClick={() => refetch()}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                <div className="flex sm:items-center">
                  <button
                    onClick={goToPrevious}
                    className="p-1 sm:p-1.5 rounded-full border border-gray-light-D3 hover:bg-gray-100 transition-colors"
                    aria-label="Previous"
                  >
                    <FiChevronLeft size={16} className="sm:w-5 sm:h-5" />
                  </button>
                  <h2 className="text-sm sm:text-base font-medium mx-3 sm:mx-4 min-w-0">
                    {viewMode === 'month'
                      ? `${currentMonth}, ${currentYear}`
                      : currentYear
                    }
                  </h2>
                  <button
                    onClick={goToNext}
                    className="p-1 sm:p-1.5 rounded-full border border-gray-light-D3 hover:bg-gray-100 transition-colors"
                    aria-label="Next"
                  >
                    <FiChevronRight size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-1 sm:gap-2  rounded-full p-1">
                  <div
                    type="button"
                    onClick={() => handleViewModeChange('month')}
                    className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-medium border border-gray-light-D3 cursor-pointer transition-color ${viewMode === 'month'
                      ? 'bg-purple-light text-white'
                      : 'bg-white text-black-0 hover:bg-gray-50'
                      }`}
                  >
                    Month
                  </div>
                  <div className="h-3 sm:h-4 w-px bg-gray-light-400 mx-1 sm:mx-1.5"></div>
                  <div
                    type="button"
                    onClick={() => handleViewModeChange('year')}
                    className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-medium border border-gray-light-D3 cursor-pointer transition-color ${viewMode === 'year'
                      ? 'bg-purple-light text-white'
                      : 'bg-white text-black-0 hover:bg-gray-50'
                      }`}
                  >
                    Year
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {viewMode === 'month' ? (
                    <MonthCalendar
                      currentDate={currentDate}
                      onDateClick={handleDateClick}
                      getEventsForDate={getEventsForDate}
                      batchesData={batchesData}
                    />
                  ) : (
                    <YearCalendar
                      currentYear={currentYear}
                      onDateClick={handleDateClick}
                      onMonthClick={handleMonthClick}
                      highlightedMonths={getHighlightedMonths()}
                      batchesData={batchesData}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {showPopover && selectedEvent && (
        <EventPopover
          event={selectedEvent}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
};

export default BatchCalendarPage;