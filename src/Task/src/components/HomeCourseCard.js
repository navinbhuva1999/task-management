import React from 'react';
import { motion } from 'framer-motion';

const HomeCourseCard = ({ course, onClick }) => {
  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="w-full h-48 rounded-lg overflow-hidden relative">
        <img
          src={course.course_image?.url || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.price > 0 ? (
          <div className="bg-orange-gradient text-white text-xs font-bold px-2 py-1 rounded-full absolute top-3 right-3">
            Paid
          </div>
        ) : (
          <div className="bg-orange-gradient text-white text-xs font-bold px-2 py-1 rounded-full absolute top-3 right-3">
            Free
          </div>
        )}
      </div>

      <div
        className="bg-white rounded-xl border border-gray-light-D3 shadow-sm py-4 px-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 mt-[-30px] z-10 mx-3 flex-1"
        onClick={onClick}
      >
        <div className="flex items-center gap-1 justify-center mb-4 bg-orange-gradient-light rounded-xl py-2">
          <div className="text-xs rounded-full flex items-center gap-1">
          <i className='icon icon-lesson text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">{course.lessons_count || 0} Lessons</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-clock text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">{course.duration_weeks || 0} Week{course.duration_weeks !== 1 ? 's' : ''}</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <div className="text-xs rounded-full flex items-center gap-1">
            <i className='icon icon-level text-gradient-orange text-sm' />
            <span className="font-medium text-10px text-black-0">{course.level || "All Levels"}</span>
          </div>
        </div>

        <h3 className="text-sm font-medium text-black-0 mb-3 leading-tight">
          {course.title}
        </h3>

        <p className="text-10px text-gray-dark-80 font-semibold mb-3 leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {course.badge && (
          <div className="absolute top-2 right-2 bg-orange-light text-white text-xs font-bold px-2 py-1 rounded-md">
            {course.badge}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HomeCourseCard; 