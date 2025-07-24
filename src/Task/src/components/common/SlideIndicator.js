import React from 'react';

const SlideIndicator = ({ 
  totalSlides, 
  currentSlide, 
  onSlideClick,
  className = "",
  size = "default" 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          inactive: 'h-1 w-1 sm:h-1.5 sm:w-1.5',
          active: 'h-2 w-2 sm:h-2.5 sm:w-2.5'
        };
      case "large":
        return {
          inactive: 'h-2 w-2 sm:h-3 sm:w-3',
          active: 'h-4 w-4 sm:h-5 sm:w-5'
        };
      default:
        return {
          inactive: 'h-1.5 w-1.5 sm:h-2 sm:w-2',
          active: 'h-3 w-3 sm:h-4 sm:w-4'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex justify-center items-center ${className}`}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideClick && onSlideClick(index)}
          className={`mx-1 rounded-full transition-all duration-300 ease-in-out ${
            currentSlide === index 
              ? `${sizeClasses.active} bg-white border-2 border-transparent bg-clip-padding`
              : `${sizeClasses.inactive} bg-[#D9D9D9] hover:bg-gray-400`
          }`}
          style={currentSlide === index ? {
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #FF6B35, #F7931E)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box'
          } : {}}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default SlideIndicator;
