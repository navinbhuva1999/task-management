import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  FiCalendar, FiChevronDown } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const EventPopover = ({ event, onClose }) => {
  const [expanded, setExpanded] = useState({});
  const popoverRef = useRef(null);

  useEffect(() => {
    setExpanded({});
  }, [event]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px'; 
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '';
    };
  }, [onClose]);

  const toggleAccordion = (id) => {
    setExpanded(prev => {
      const newExpanded = {};
      Object.keys(prev).forEach(key => {
        newExpanded[key] = false;
      });
      newExpanded[id] = !prev[id];
      return newExpanded;
    });
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.15,
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 10,
      transition: { duration: 0.1 } 
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return 'No Date';
    }

    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const day = dateObj.getDate();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[dateObj.getMonth()];

    return `${day} ${month}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const eventData = {
    date: event?.date || new Date(),
    batches: event?.batches || (event?.title ? [event] : []), 
    allEvents: event?.allEvents || []
  };


  if (!event || !event.batches || event.batches.length === 0) {
    return null;
  }

  const events = eventData.batches && eventData.batches.length > 0
    ? eventData.batches.map((batch, index) => {
      const tutorsList = batch.tutors || [];
      const primaryTutor = tutorsList.length > 0 ? tutorsList[0] : null;

      const startDate = batch.startDate || batch.start_date || batch.start;
      const endDate = batch.endDate || batch.end_date || batch.end;
      
      const startDateObj = startDate ? (startDate instanceof Date ? startDate : new Date(startDate)) : null;
      const endDateObj = endDate ? (endDate instanceof Date ? endDate : new Date(endDate)) : null;

      return {
        id: batch.id || index,
        title: batch.title || batch.course?.title || batch.name || 'Untitled Batch',
        time: startDateObj ? formatTime(startDateObj) : '1:00 PM',
        tutor: primaryTutor?.name || 'No tutor assigned',
        tutorEmail: primaryTutor?.email || '',
        color: index === 0 ? 'orange' : index === 1 ? 'purple' : 'green',
        startDate: startDateObj,
        endDate: endDateObj,
        course: batch.course,
        joiningUrl: batch.joining_url || batch.joiningUrl,
        batchName: batch.name,
        allTutors: tutorsList
      };
    })
    : [
      {
        id: 1,
        title: event?.title || 'Program Bell',
        time: event?.time || '11:30 AM - 12:30 PM',
        tutor: event?.tutor || 'Jerome Bell',
        tutorTime: event?.tutorTime || '20 Min',
        color: 'orange'
      }
    ];

  const getEventColors = (color) => {
    switch (color) {
      case 'orange':
        return {
          bg: 'bg-orange-50',
          dot: 'bg-orange-500',
          border: 'border-orange-200'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          dot: 'bg-purple-600',
          border: 'border-purple-200'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          dot: 'bg-green-500',
          border: 'border-green-200'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          dot: 'bg-blue-500',
          border: 'border-blue-200'
        };
      default:
        return {
          bg: 'bg-orange-50',
          dot: 'bg-orange-500',
          border: 'border-orange-200'
        };
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ 
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      >
        <motion.div
          ref={popoverRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-light-D3 overflow-hidden relative mx-auto my-auto"
        >
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-purple-50 opacity-50"></div>
            <div className="relative bg-gray-dark-F6 p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center">
                <motion.div 
                  className="bg-orange-gradient rounded-full p-3 text-white mr-3"
                  initial={{ scale: 0.9, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 300, duration: 0.1 }}
                >
                  <FiCalendar size={20} />  
                </motion.div>
                <div>
                  <motion.h3 
                    className="font-bold text-lg text-black-0"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.1 }}
                  >
                    {formatDate(eventData.date)}
                  </motion.h3>
                  <motion.div 
                    className="text-xs text-gray-dark-80 font-medium mt-1"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.1 }}
                  >
                    {eventData.batches.length > 1 
                      ? `${eventData.batches.length} Scheduled Batches`
                      : 'View All Your Scheduled Courses'
                    }
                  </motion.div>
                </div>
              </div>
              <motion.button
                className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-sm"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.1 }}
              >
                <IoClose size={18} />
              </motion.button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-hidden">
            <motion.h4 
              className="font-semibold text-black-0 mb-3 text-base"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.1 }}
            >
              Scheduled Courses
            </motion.h4>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
              {events.map((event, index) => {
                const colorClasses = getEventColors(event.color);
                
                return (
                  <motion.div 
                    key={event.id} 
                    className={`border rounded-xl overflow-hidden ${colorClasses.border} shadow-sm hover:shadow-md transition-shadow duration-200`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.15 }}
                  >
                    <div 
                      className={`flex items-center p-4 cursor-pointer ${colorClasses.bg} hover:opacity-90 transition-opacity`}
                      onClick={() => toggleAccordion(event.id)}
                    >
                      <motion.div 
                        className={`w-3 h-3 rounded-full mr-3 ${colorClasses.dot}`}
                        animate={{ scale: expanded[event.id] ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 300, duration: 0.1 }}
                      ></motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-black-0 text-sm">{event.time}</span>
                            <span className="mx-2 text-gray-dark-80 font-medium">|</span>
                            <span className="font-medium text-xs text-black-0">
                              {event.batchName ? `${event.title} (${event.batchName})` : event.title}
                            </span>
                          </div>
                          <motion.button 
                            className="text-gray-500 p-1 ml-2 hover:text-gray-700 transition-colors"
                            animate={{ rotate: expanded[event.id] ? 180 : 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <FiChevronDown size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expanded[event.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden bg-white"
                        >
                          <div className="p-4 border-t border-gray-100">
                            <div className="space-y-3">
                              <motion.div 
                                className="flex items-center justify-between"
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05, duration: 0.1 }}
                              >
                                <div className="text-gray-dark-80 text-sm font-medium">Duration</div>
                                <div className="font-semibold text-black-0 text-sm bg-gray-50 px-3 py-1 rounded-full">
                                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                                </div>
                              </motion.div>
                              
                              <motion.div 
                                className="flex items-center justify-between"
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.1 }}
                              >
                                <div className="text-gray-dark-80 text-sm font-medium">Tutor Name</div>
                                <div className="font-semibold text-black-0 text-sm bg-purple-50 px-3 py-1 rounded-full">
                                  {event.tutor}
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventPopover; 