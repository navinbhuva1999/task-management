import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const MonthCalendar = ({ 
  currentDate, 
  onDateClick, 
  getEventsForDate, 
  batchesData = [] 
}) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [animationDirection, setAnimationDirection] = useState(1); 
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const eventsData = useMemo(() => {
    if (!getEventsForDate || batchesData.length === 0) {
      return {
        '2024-10-26': [
          { 
            id: 1, 
            title: 'No Title', 
            time: '1 AM : 2 AM',
            tutor: 'Jerome Bell',
            tutorTime: '20 Min',
            color: 'bg-blue-100 text-blue-800 border-blue-200'
          }
        ],
        '2024-10-27': [
          { 
            id: 2, 
            title: 'Program Bell', 
            time: '11:30 AM - 12:30 PM',
            tutor: 'Jerome Bell',
            tutorTime: '20 Min',
            color: 'bg-orange-100 text-orange-800 border-orange-200'
          },
          { 
            id: 3, 
            title: 'Interns Bell', 
            time: '12:30 AM',
            tutor: 'Jerome Bell',
            tutorTime: '20 Min',
            color: 'bg-purple-100 text-purple-800 border-purple-200'
          },
          { 
            id: 4, 
            title: 'Finance Bell', 
            time: '3:30 PM',
            tutor: 'Jerome Bell',
            tutorTime: '20 Min',
            color: 'bg-green-100 text-green-800 border-green-200'
          }
        ],
        '2024-10-30': [
          { 
            id: 5, 
            title: 'Program Management', 
            time: '9:30 AM - 10:30 AM',
            tutor: 'Jerome Bell',
            tutorTime: '20 Min',
            color: 'bg-orange-100 text-orange-800 border-orange-200'
          }
        ]
      };
    }
    
    const dynamicEvents = {};
    
    batchesData.forEach(batch => {
      const startDate = new Date(batch.start_date);
      
      const dateKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
      
      if (!dynamicEvents[dateKey]) {
        dynamicEvents[dateKey] = [];
      }
      
      dynamicEvents[dateKey].push({
        id: batch.id,
        title: batch.course.title,
        name: batch.name,
        startDate: new Date(batch.start_date),
        endDate: new Date(batch.end_date),
        course: batch.course,
        tutors: batch.tutors,
        joiningUrl: batch.joining_url,
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      });
    });
    
    return dynamicEvents;
  }, [getEventsForDate, batchesData]);

  useEffect(() => {
    const prevDirection = currentDate.getTime() > (new Date()).getTime() ? 1 : -1;
    setAnimationDirection(prevDirection);
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    
    const daysFromPrevMonth = firstDayOfWeek;
    
    const totalDays = daysFromPrevMonth + lastDay.getDate();
    
    const rows = Math.ceil(totalDays / 7);
    
    const totalCells = rows * 7;
    
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const day = prevMonthLastDay - daysFromPrevMonth + i + 1;
      days.push({
        day,
        month: month - 1,
        year,
        isCurrentMonth: false,
        date: new Date(year, month - 1, day)
      });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        month: month + 1,
        year,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    setCalendarDays(days);
    
  }, [currentDate, eventsData]);

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const calendarVariants = {
    hidden: { 
      opacity: 0, 
      x: animationDirection * 50 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        duration: 0.3 
      }
    },
    exit: { 
      opacity: 0, 
      x: animationDirection * -50,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className="calendar-container w-full overflow-auto">
      <motion.div
        key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
        variants={calendarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-w-[768px] md:min-w-0"
      >
        <div className="grid grid-cols-7 gap-1 mb-2 sticky top-0 z-10 bg-white">
          {dayNames.map((day, index) => (
            <div 
              key={index}
              className="py-2 text-center rounded-xl text-sm bg-orange-gradient-light font-medium text-black-0"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dateEvents = getEventsForDate(day.date);
            const hasEvents = dateEvents.length > 0;
            
            return (
              <div 
                key={index}
                className={`
                  min-h-[100px] p-2 rounded-lg border border-gray-light-200
                  ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                  ${isToday(day.date) ? 'border-purple-300' : ''}
                  ${hasEvents ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'} transition-colors h-full flex flex-col justify-center items-center
                `}
                onClick={(e) => {
                  if (hasEvents) {
                    onDateClick(day.date, dateEvents, e.currentTarget);
                  }
                }}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full text-sm
                    ${isToday(day.date) ? 'bg-purple-light text-white' : ''}
                    font-medium
                  `}>
                    {day.day}
                  </span>
                </div>
                
                <div className="mt-1 space-y-1 w-full">
                  {dateEvents.slice(0, 3).map((event, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`text-xs p-1.5 rounded border ${event.color || 'bg-purple-100 text-purple-800 border-purple-200'}`}
                    >
                      <div className="font-semibold text-black-0 text-xs truncate">{event.title}</div>
                      <div className="text-[10px] font-medium mt-0.5 truncate text-gray-dark-80">{event.time}</div>
                    </motion.div>
                  ))}
                  
                  {dateEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium mt-1">
                      +{dateEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default MonthCalendar;