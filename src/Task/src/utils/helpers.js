/**
 * Returns a greeting based on the current time of day
 * @returns {string} The appropriate greeting (Good Morning, Good Afternoon, Good Evening)
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string (e.g., "September 21, 2023")
 */
export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}; 