import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RelatedCourses = ({ courses = [], onCourseClick }) => {
  const navigate = useNavigate();

  const navigateToCourse = (course) => {
    const slug = course.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    navigate(`/dashboard/course/${course.id}/${slug}`);
  };

  return (
    <div className="bg-white rounded-[18px] shadow-sm border border-gray-light-D3 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-black-0 mb-3 sm:mb-0">Related courses</h2>
        <Link
          to="/dashboard/courses"
          className="bg-purple-gradient text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:opacity-90 transition-opacity w-fit"
        >
          Browse all courses
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-light-D3 rounded-lg hover:shadow-md transition-shadow cursor-pointer flex"
              onClick={() => navigateToCourse(course)}
            >
              <div className="w-20 h-16 sm:w-1/3 sm:h-24 bg-gray-100 rounded-l-lg overflow-hidden flex-shrink-0">
                {course.course_image?.url ? (
                  <img
                    src={course.course_image.url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/fallback.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-light">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 sm:w-10 sm:h-10"
                    >
                      <path
                        d="M36.6667 20.0002C36.6667 29.2002 29.2 36.6668 20 36.6668C10.8 36.6668 3.33334 29.2002 3.33334 20.0002C3.33334 10.8002 10.8 3.3335 20 3.3335C29.2 3.3335 36.6667 10.8002 36.6667 20.0002Z"
                        stroke="#FF6B00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M26.1833 25.3L21.0167 22.2167C20.1167 21.6833 19.4 20.4 19.4 19.35V11.8167"
                        stroke="#FF6B00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 p-3 sm:p-4">
                <h3 className="font-medium text-black-0 text-sm sm:text-base line-clamp-2">{course.title}</h3>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-2 line-clamp-2 hidden sm:block">
                  {course.description && course.description.length > 100
                    ? course.description.substring(0, 100) + '...'
                    : course.description}
                </p>

                {course.batch_tutor && course.batch_tutor.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                    {course.batch_tutor.map(
                      (bt, idx) =>
                        bt.tutor && (
                          <span
                            key={idx}
                            className="text-xs bg-orange-50 text-orange-light px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full cursor-pointer hover:bg-orange-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCourseClick && onCourseClick(bt.tutor);
                            }}
                          >
                            {bt.tutor.name}
                          </span>
                        )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="bg-gray-100 rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No related courses</h3>
          <p className="text-xs sm:text-sm text-gray-500">There are no related courses at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedCourses;
