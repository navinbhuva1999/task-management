import React, { useState, useRef } from 'react';

const Streakpad = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [year, setYear] = useState(2025);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const scrollContainerRef = useRef(null);

  // Handle tooltip display
  const showTooltip = (day, month, week, value) => {
    setActiveTooltip({ day, month, week, value });
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Mock data for streaks - expanded for all months
  const generateMonthData = () => {
    const monthsData = {};

    months.forEach((month, monthIndex) => {
      // Generate 5 weeks of data for each month
      const weekData = [
        // Each array represents a day (Sun-Sat)
        [3, 3, 2, 1, 0], // Sunday data for 5 weeks
        [2, 2, 0, 0, 0], // Monday data for 5 weeks
        [3, 2, 3, 2, 1], // Tuesday data for 5 weeks
        [1, 1, 2, 0, 0], // Wednesday data for 5 weeks
        [1, 1, 2, 0, 0], // Thursday data for 5 weeks
        [0, 0, 1, 2, 0], // Friday data for 5 weeks
        [0, 1, 2, 0, 0], // Saturday data for 5 weeks
      ];

      // Vary data slightly for each month to make it look realistic
      monthsData[month] = weekData.map(dayData =>
        dayData.map(value =>
          Math.min(3, Math.max(0, value + (Math.random() > 0.7 ? Math.floor(Math.random() * 2) - 1 : 0)))
        )
      );
    });

    return monthsData;
  };

  const streakData = {
    year,
    data: generateMonthData()
  };

  // Get text description for a value
  const getValueDescription = (value) => {
    switch (value) {
      case 0: return 'No activity';
      case 1: return '1 Lumie completed';
      case 2: return '2 Lumies completed';
      case 3: return '3+ Lumies completed';
      default: return 'No data';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 mx-6 sm:mx-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-gray-100">
        <div className="flex items-center mb-3 sm:mb-0">
          <h3 className="text-lg font-semibold">Streakpad</h3>
        </div>
        <div className="flex w-full justify-end items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm mr-2">Year</span>
            <div className="relative">
              <select
                className="text-sm border border-gray-light-D3 rounded-[15px] px-4 py-2 pr-8 appearance-none bg-white"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <i className="icon icon-bottom_arrow text-black-0 text-[8px]"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          
          <div style={{ width: `${months.length * 190}px`, minWidth: '100%' }}>
            <div className="flex mb-2">
              <div className="w-12 flex-shrink-0"></div> {/* Space for day labels */}
              {months.map((month, idx) => (
                <div key={idx} className="w-[180px] text-center text-xs text-black-0 font-bold py-2 px-1 bg-orange-gradient-light rounded-md mx-0.5">
                  {month}
                </div>
              ))}
            </div>

            <div className="flex flex-col space-y-1">
              {days.map((day, dayIdx) => (
                <div key={dayIdx} className="flex items-center">
                  <div className="w-12 flex-shrink-0">
                    <span className="text-xs text-black-0 font-medium">{day}</span>
                  </div>

                  <div className="flex">
                    {months.map((month, monthIdx) => (
                      <div key={`${day}-${month}`} className="w-[180px] flex space-x-1 mx-0.5">
                        {Array(5).fill(0).map((_, weekIdx) => {
                          const value = streakData.data[month][dayIdx][weekIdx] || 0;
                          let bgColor = 'bg-purple-gradient-light';
                          if (value === 1) bgColor = 'bg-purple-300';
                          if (value === 2) bgColor = 'bg-purple-500';
                          if (value === 3) bgColor = 'bg-purple-800';

                          return (
                            <div
                              key={`${dayIdx}-${monthIdx}-${weekIdx}`}
                              className={`flex-1 h-8 w-8 rounded-lg ${bgColor} transition-all hover:scale-110 cursor-pointer relative`}
                              title={`${days[dayIdx]}, ${month}, Week ${weekIdx + 1}: ${getValueDescription(value)}`}
                              onMouseEnter={() => showTooltip(day, month, weekIdx + 1, value)}
                              onMouseLeave={hideTooltip}
                            >
                              {activeTooltip &&
                                activeTooltip.day === day &&
                                activeTooltip.month === month &&
                                activeTooltip.week === weekIdx + 1 && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                                    {`${day}, ${month}, Week ${weekIdx + 1}: ${getValueDescription(value)}`}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center mt-8 space-y-2 sm:space-y-0">
          <span className="text-xs text-gray-600 mr-1">Less</span>
          <div className="flex space-x-1 mx-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <div className="w-4 h-4 bg-purple-300 rounded"></div>
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <div className="w-4 h-4 bg-purple-800 rounded"></div>
          </div>
          <span className="text-xs text-gray-600 ml-1">More</span>
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">Less Than 3 Lumies</div>
      </div>
    </div>
  );
};

export default Streakpad; 