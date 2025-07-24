import React from 'react';
import { motion } from 'framer-motion';

const YearCalendar = ({ 
  currentYear, 
  onDateClick, 
  onMonthClick, 
  highlightedMonths = [], 
  batchesData = [] 
}) => {

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const hasEvents = (year, month, day) => {
    const date = new Date(year, month, day);
    const targetDateString = date.toDateString();
    
    return batchesData.some(batch => {
      const startDate = new Date(batch.start_date);
      return startDate.toDateString() === targetDateString;
    });
  };

  const getEventsForDate = (year, month, day) => {
    const date = new Date(year, month, day);
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
      joiningUrl: batch.joining_url
    }));
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const handleDateClick = (date, events, element) => {
    
    if (events && events.length > 0) {
      onDateClick(date, events, element);
    }
  };  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const monthVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const renderMonth = (monthIndex) => {
    const daysInMonth = getDaysInMonth(currentYear, monthIndex);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, monthIndex);
    
    const totalCells = 42;
    
    const days = [];
    
    const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevMonthYear = monthIndex === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = getDaysInMonth(prevMonthYear, prevMonth);
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = prevMonthDays - firstDayOfMonth + i + 1;
      days.push({
        day,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: monthIndex,
        year: currentYear,
        isCurrentMonth: true
      });
    }
    
    const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
    const nextMonthYear = monthIndex === 11 ? currentYear + 1 : currentYear;
    
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      days.push({
        day: nextMonthDay++,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false
      });
    }

    return (
      <motion.div 
        key={monthIndex}
        variants={monthVariants}
        className="p-3 border border-gray-light-D3 rounded-lg"
      >
        <div 
          className={`text-center mb-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
            highlightedMonths.includes(monthIndex)
              ? 'bg-orange-gradient-light text-black-0 shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onMonthClick && onMonthClick(monthIndex)}
          title={highlightedMonths.includes(monthIndex) ? "Has scheduled batches" : "No scheduled batches"}
        >
          {monthNames[monthIndex]}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium h-6 w-8">
              {day}
            </div>
          ))}
          
          {days.map((dayObj, index) => {
            const { day, month, year, isCurrentMonth } = dayObj;
            const hasEventForDay = hasEvents(year, month, day);
            const isTodayDate = isToday(year, month, day);
            
            return (
              <div 
                key={index}
                onClick={(e) => {
                  const date = new Date(year, month, day);
                  const events = getEventsForDate(year, month, day);
                  if (events && events.length > 0) {
                    handleDateClick(date, events, e.currentTarget);
                  }
                }}
                className={`
                  text-center p-0.5 h-8 w-8 relative
                  ${!isCurrentMonth ? 'text-gray-400' :
                    isTodayDate ? 'bg-purple-light text-white rounded-full font-medium' :
                    hasEventForDay ? 'bg-purple-100 text-purple-light rounded-full font-medium cursor-pointer' : 
                    'text-black-0 font-medium cursor-default'
                  }
                  ${hasEventForDay ? 'hover:bg-gray-light-100' : ''} transition-colors
                `}
              >
                <span className="text-xs">{day}</span>
                {hasEventForDay && !isTodayDate && (
                  <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-light rounded-full"></span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      key={currentYear}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {monthNames.map((_, index) => renderMonth(index))}
    </motion.div>
  );
};

export default YearCalendar; 