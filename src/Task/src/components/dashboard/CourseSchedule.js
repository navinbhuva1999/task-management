import React from 'react';

const CourseSchedule = ({ batches = [], onTutorClick, onBatchClick }) => {
  const groupBatchesByDate = () => {
    const grouped = {};

    batches.forEach(batch => {
      const startDate = new Date(batch.start_date);
      if (!isNaN(startDate.getTime())) {
        const dateKey = startDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }

        grouped[dateKey].push(batch);
      }
    });

    return grouped;
  };

  const batchesByDate = groupBatchesByDate();
  const dateKeys = Object.keys(batchesByDate);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-[18px] shadow-sm border border-gray-light-D3 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-black-0">Courses scheduled</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">See your scheduled courses and stay on top of upcoming sessions.</p>

      {dateKeys.length > 0 ? (
        <div className="rounded-lg overflow-hidden">
          {dateKeys.map((dateKey, index) => (
            <div key={dateKey} className="mb-4 sm:mb-6 last:mb-0">
              <div className="bg-purple-gradient py-2 sm:py-3 px-3 sm:px-4">
                <div className="flex items-center">
                  <div className="bg-white p-1 rounded-full text-orange-light mr-2">
                    <i className='icon icon-calender text-gradient-orange bg-white text-base sm:text-lg m-1' />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-white">{dateKey}</span>
                </div>
              </div>

              <div className="bg-purple-light bg-opacity-10 p-3 sm:p-4">
                {batchesByDate[dateKey].map((batch, idx) => (
                  <div 
                    key={`${batch.id}-${idx}`} 
                    className="bg-white rounded-lg mb-3 last:mb-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex"
                    onClick={() => onBatchClick && onBatchClick(batch)}
                  >
                    <div className="w-1 bg-orange-light rounded-l-lg my-4 self-stretch"></div>
                    
                    <div className="flex-1 px-2 sm:px-3 py-2 sm:py-3">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <i className='icon icon-betch text-gradient-orange text-base sm:text-lg' />
                          <span className="font-semibold text-xs sm:text-sm">{batch.name}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <i className='icon icon-clock text-gradient-orange text-base sm:text-lg' />
                          <span className="text-xs sm:text-sm font-semibold">{formatTime(batch.start_date)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center flex-wrap">
                        {batch.tutors && batch.tutors.length > 0 && (
                          <div className="flex items-start flex-wrap">
                            <div className="flex flex-col">
                              <div className="flex flex-wrap gap-1 mt-1">
                                {batch.tutors.map((tutor, tidx) => (
                                  <div className="flex items-center gap-1 mb-1" key={tidx}>
                                    <i className='icon icon-user text-gradient-orange text-base sm:text-lg' />
                                    <span 
                                      className="text-xs sm:text-sm font-semibold text-black-0 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full cursor-pointer hover:bg-orange-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onTutorClick && onTutorClick(tutor);
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
                        <div className="flex items-center gap-1 sm:gap-2">
                          <i className='icon icon-rupees text-gradient-orange text-base sm:text-lg' />
                          <span className="text-xs sm:text-sm font-semibold">{batch.price || "3999"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="bg-gray-100 rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <i className='icon icon-calender text-gray-400 text-xl sm:text-2xl' />
          </div>
          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No scheduled courses</h3>
          <p className="text-xs sm:text-sm text-gray-500">There are no scheduled courses at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default CourseSchedule; 