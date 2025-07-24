import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DashboardBatchCourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/course/${course.id}`);
  };

  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-48 rounded-lg overflow-hidden">
        <img 
          src={course.course_image?.url || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div 
        className="bg-white rounded-xl border border-gray-light-D3 shadow-sm sm:py-4 py-3  sm:px-3 px-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 mt-[-30px] z-10 mx-3 flex-1"
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-1 justify-center mb-4 bg-orange-gradient-light rounded-xl py-2">
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-lesson text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">{course.lessons || 0} Lessons</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-clock text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">{course.duration || 0} Week{course.duration_weeks !== 1 ? 's' : ''}</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-level text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">{course.level || ""}</span>
          </div>
        </div>
        
        <h3 className="sm:text-sm text-xs font-medium text-black-0 mb-3 leading-tight">
          {course.title}
        </h3>
        
        <p className="text-10px text-gray-dark-80 font-semibold mb-3 leading-relaxed line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center sm:mb-3 mb-2">
          <div className="flex items-center text-sm text-gray-700">
            <span className="text-gradient-orange mr-2">
              <i className='icon icon-user text-gradient-orange text-sm' />
            </span>
            <div className="flex items-center gap-x-0.5">
              {course.tutors && course.tutors.length > 0 ? (
                course.tutors.map((tutorInfo, index) => (
                  <React.Fragment key={index}>
                    <span className="font-medium text-9px text-black-0">{tutorInfo}</span>
                    {index < course.tutors.length - 1 && (
                      <div className="h-3 w-px bg-gray-300 mx-1"></div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="font-medium text-9px text-black-0">No tutors assigned</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-x-2">
          <div className="flex items-center text-sm gap-x-2">
            <i className='icon icon-calender text-gradient-orange text-sm' />
            <span className="font-medium text-9px text-black-0">{course.date || '-'}</span>
          </div>
          <div className="h-3 w-px bg-gray-300 mx-1"></div>
          <div className="flex items-center text-sm gap-x-1">
            <i className='icon icon-clock text-gradient-orange text-sm' />
            <span className="font-medium text-9px text-black-0">{course.time || '-'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardBatchCourseCard; 