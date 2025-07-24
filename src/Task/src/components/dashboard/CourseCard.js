import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/course/${course.id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-light-D3 animate-fade-in"
      onClick={handleCardClick}
    >
      <div className="p-5 sm:p-4 md:p-5">
        {/* Lessons Info */}
        <div className="flex items-center gap-1 sm:gap-1 md:gap-2 justify-center mb-5 sm:mb-4 md:mb-5 bg-orange-gradient-light rounded-xl py-2 sm:py-1.5 md:py-2">
          {[
            { icon: 'icon-lesson', text: '7 Lessons' },
            { icon: 'icon-clock', text: '10 Week' },
            { icon: 'icon-level', text: 'All levels' },
          ].map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <div className="h-4 w-px bg-gray-300 mx-1" />}
              <div className="text-xs sm:text-[11px] md:text-xs rounded-full flex items-center gap-1">
                <i className={`icon ${item.icon} text-gradient-orange text-sm sm:text-xs md:text-sm`} />
                <span className="font-medium text-10px sm:text-[10px] md:text-10px text-black-0">{item.text}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-sm md:text-base font-medium text-black-0 mb-[14px] leading-tight">
          {course.title || "Certified associate in project management (CAPM)®"}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-[11px] md:text-xs text-gray-dark-80 font-semibold mb-[14px] leading-relaxed">
          {course.description || "The PMI Construction Professional (PMI-CP)™ certification is a globally recognized"}
        </p>

        {/* Instructors */}
        <div className="flex items-center mb-4 sm:mb-3 md:mb-4">
          <div className="flex items-center text-sm sm:text-xs md:text-sm text-gray-700">
            <span className="text-gradient-orange mr-2 sm:mr-1 md:mr-2">
              <i className='icon icon-user text-gradient-orange text-sm sm:text-xs md:text-sm' />
            </span>
            <div className="flex items-center gap-x-1 sm:gap-x-1 md:gap-x-1.5">
              {['Cameron Williamson', 'Jenny Wilson', 'Robert Fox'].map((name, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <div className="h-3 w-px bg-gray-300 mx-1" />}
                  <span className="font-medium text-10px sm:text-[10px] md:text-10px text-black-0">{name}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-x-2 sm:gap-x-1 md:gap-x-2">
          <div className="flex items-center text-sm sm:text-xs md:text-sm text-orange-600">
            <i className='icon icon-calendar text-gradient-orange text-sm sm:text-xs md:text-sm' />
            <span className="font-medium text-10px sm:text-[10px] md:text-10px text-black-0">
              {course.date || "September 21, 2024"}
            </span>
          </div>
          <div className="h-3 w-px bg-gray-300 mx-1" />
          <div className="flex items-center text-sm sm:text-xs md:text-sm text-orange-600">
            <i className='icon icon-clock text-gradient-orange text-sm sm:text-xs md:text-sm' />
            <span className="font-medium text-10px sm:text-[10px] md:text-10px text-black-0">
              {course.time || "00:02 AM"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
