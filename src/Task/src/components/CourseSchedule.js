// src\components\CourseSchedule.js
import React from 'react';

const CourseSchedule = ({ batches = [], onTutorClick, onBatchClick }) => {
  const batchesByDate = batches.reduce((acc, batch) => {
    const date = new Date(batch.start_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!acc[date]) acc[date] = [];
    acc[date].push(batch);
    return acc;
  }, {});

  if (!batches || batches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Courses scheduled</h2>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-4">
          No batches are currently scheduled for this course.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 border border-gray-200">
      <h2 className="text-lg sm:text-xl font-bold mb-2 text-black-0 text-center sm:text-left">
        Courses scheduled
      </h2>
      <p className="text-gray-dark-80 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base font-medium text-center sm:text-left">
        See your scheduled courses and stay on top of upcoming sessions.
      </p>

      <div className="rounded-lg border border-gray-200 bg-purple-gradient p-3 sm:p-4 flex flex-col gap-4 sm:gap-5 md:gap-6">
        {Object.entries(batchesByDate).map(([date, dateBatches], index) => (
          <div key={index}>
            <div className="text-white">
              {/* Date header */}
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-white p-0.5 sm:p-1 rounded-full mr-1 sm:mr-2">
                  <i className="icon icon-calender text-gradient-orange bg-white text-base sm:text-lg m-0.5 sm:m-1" />
                </div>
                <span className="font-bold text-sm sm:text-base">{date}</span>
              </div>

              {/* Batches list */}
              <div className="space-y-2 sm:space-y-3">
                {dateBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="bg-white text-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer flex"
                    onClick={() => onBatchClick && onBatchClick(batch)}
                  >
                    <div className="w-1 bg-orange-gradient rounded-l-lg my-2 sm:my-4 self-stretch"></div>

                    <div className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2">
                      {/* Name and Time */}
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <i className="icon icon-betch text-gradient-orange text-base sm:text-lg" />
                          <span className="font-semibold text-xs sm:text-sm">{batch.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <i className="icon icon-clock text-gradient-orange text-base sm:text-lg" />
                          <span className="text-xs sm:text-sm font-semibold">
                            {new Date(batch.start_date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Tutors and Price */}
                      <div className="flex justify-between items-center">
                        {batch.tutors?.length > 0 && (
                          <div className="flex items-start">
                            <div className="flex flex-col">
                              <div className="flex gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 flex-wrap">
                                {batch.tutors.map((tutor, idx) => (
                                  <div className="flex items-center gap-0.5 sm:gap-1" key={idx}>
                                    <i className="icon icon-user text-gradient-orange text-base sm:text-lg" />
                                    <span
                                      className="text-xs sm:text-sm font-semibold text-black-0 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full cursor-pointer hover:bg-orange-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onTutorClick?.(tutor);
                                      }}
                                    >
                                      {tutor.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <i className="icon icon-rupees text-gradient-orange text-base sm:text-lg" />
                          <span className="text-xs sm:text-sm font-semibold">{batch.price || '3999'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {index !== Object.entries(batchesByDate).length - 1 && (
              <div className="border-b border-gray-300 border-opacity-40 mt-4 sm:mt-6 mb-0"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSchedule;
