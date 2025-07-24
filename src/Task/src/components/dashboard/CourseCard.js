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
      <div className="p-5">
        <div className="flex items-center gap-1 justify-center mb-5 bg-orange-gradient-light rounded-xl py-2">
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-lesson text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">7 Lessons</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-clock text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">10 Week</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-level text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">All levels</span>
          </div>
        </div>
        
        <h3 className="text-base font-medium text-black-0 mb-[14px] leading-tight">
          {course.title || "Certified associate in project management (capm)®"}
        </h3>
        
        <p className="text-xs text-gray-dark-80 font-semibold mb-[14px] leading-relaxed">
          {course.description || "The pmi construction professional (pmi-cp)™ certification is a globally recognized"}
        </p>
        
        {/* Instructors */}
        <div className="flex items-center mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <span className="text-gradient-orange mr-2">
              <i className='icon icon-user text-gradient-orange text-sm' />
            </span>
            <div className="flex items-center gap-x-1">
              <span className="font-medium text-10px text-black-0">Cameron williamson</span>
              <div className="h-3 w-px bg-gray-300 mx-1"></div>
              <span className="font-medium text-10px text-black-0">Jenny wilson</span>
              <div className="h-3 w-px bg-gray-300 mx-1"></div>
              <span className="font-medium text-10px text-black-0">Robert fox</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-x-2">
          <div className="flex items-center text-sm text-orange-600">
            <i className='icon icon-calendar text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">{course.date || "September 21, 2024"}</span>
          </div>
          <div className="h-3 w-px bg-gray-300 mx-1"></div>
          <div className="flex items-center text-sm text-orange-600">
            <i className='icon icon-clock text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">{course.time || "00:02 AM"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;