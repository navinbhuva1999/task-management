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
      {/* Course image */}
      <div className="w-full h-36 sm:h-40 md:h-44 lg:h-48 rounded-lg overflow-hidden">
        <img
          src={
            course.course_image?.url ||
            'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070&q=80'
          }
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card content */}
      <div
        className="bg-white rounded-xl border border-gray-light-D3 shadow-sm py-3 px-2 sm:py-3.5 sm:px-3 md:py-4 md:px-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 mt-[-24px] sm:mt-[-26px] md:mt-[-30px] z-10 mx-2 sm:mx-3 flex-1"
        onClick={handleCardClick}
      >
        {/* Info badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 justify-center mb-3 sm:mb-3.5 md:mb-4 bg-orange-gradient-light rounded-lg py-1.5 sm:py-2">
          <div className="text-[10px] sm:text-xs flex items-center gap-1">
            <i className="icon icon-lesson text-gradient-orange text-[11px] sm:text-sm" />
            <span className="font-medium text-10px text-black-0">{course.lessons || 0} Lessons</span>
          </div>
          <div className="h-3 sm:h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-[10px] sm:text-xs flex items-center gap-1">
            <i className="icon icon-clock text-gradient-orange text-[11px] sm:text-sm" />
            <span className="font-medium text-10px text-black-0">{course.duration || 0} Week{course.duration !== 1 ? 's' : ''}</span>
          </div>
          <div className="h-3 sm:h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-[10px] sm:text-xs flex items-center gap-1">
            <i className="icon icon-level text-gradient-orange text-[11px] sm:text-sm" />
            <span className="font-medium text-10px text-black-0">{course.level || ''}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm md:text-base mb-2 sm:mb-3 leading-tight text-black-0">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-[10px] sm:text-xs text-gray-dark-80 font-semibold mb-2 sm:mb-3 leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Tutors */}
        <div className="flex items-center mb-2 sm:mb-3 border-t border-gray-light-D5 border-opacity-40 pt-1.5 sm:pt-2">
          <div className="flex items-center text-[10px] sm:text-xs text-gray-700">
            <span className="text-gradient-orange mr-1 sm:mr-2">
              <i className="icon icon-user text-gradient-orange text-[11px] sm:text-sm" />
            </span>
            <div className="flex items-center gap-x-0.5 sm:gap-x-1">
              {course.tutors && course.tutors.length > 0 ? (
                course.tutors.map((tutorInfo, index) => (
                  <React.Fragment key={index}>
                    <span className="font-medium text-[9px] sm:text-[10px] text-black-0">{tutorInfo}</span>
                    {index < course.tutors.length - 1 && (
                      <div className="h-2.5 sm:h-3 w-px bg-gray-300 mx-1"></div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="font-medium text-[9px] sm:text-[10px] text-black-0">No tutors assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-x-1 sm:gap-x-2">
          <div className="flex items-center text-[10px] sm:text-xs gap-x-1">
            <i className="icon icon-calender text-gradient-orange text-[11px] sm:text-sm" />
            <span className="font-medium text-[9px] sm:text-[10px] text-black-0">{course.date || '-'}</span>
          </div>
          <div className="h-2.5 sm:h-3 w-px bg-gray-300 mx-1"></div>
          <div className="flex items-center text-[10px] sm:text-xs gap-x-1">
            <i className="icon icon-clock text-gradient-orange text-[11px] sm:text-sm" />
            <span className="font-medium text-[9px] sm:text-[10px] text-black-0">{course.time || '-'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardBatchCourseCard;
