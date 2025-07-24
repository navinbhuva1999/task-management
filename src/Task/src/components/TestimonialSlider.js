import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ quote, author, position, isActive }) => {
  return (
    <motion.div 
      className={`bg-white p-6 rounded-xl shadow-md mx-2 transition-all duration-300 ${
        isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
      }`}
      whileHover={{ scale: isActive ? 1.02 : 0.95 }}
    >
      <div className="flex items-center mb-4">
        <div className="text-yellow-400 flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-gray-600 mb-4 italic">"{quote}"</p>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
          <img src={`https://i.pravatar.cc/150?u=${author}`} alt={author} className="h-full w-full object-cover" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{author}</p>
          <p className="text-xs text-gray-500">{position}</p>
          <p className="text-xs text-gray-500">alma.lawson@example.com</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const testimonials = [
    {
      id: 0,
      quote: "I think educate is the best theme I ever seen this year. amazing design, easy to scustomize and a design.",
      author: "Cameron williamson",
      position: "PMP Certified"
    },
    {
      id: 1,
      quote: "I think educate is the best theme I ever seen this year. amazing design, easy to scustomize and a design.",
      author: "Cameron williamson",
      position: "PMI-ACP Certified"
    },
    {
      id: 2,
      quote: "I think educate is the best theme I ever seen this year. amazing design, easy to scustomize and a design.",
      author: "Cameron williamson",
      position: "CAPM Certified"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative">
      {/* Desktop Slider */}
      <div className="hidden md:flex justify-center items-center" style={{ height: '300px' }}>
        {testimonials.map((testimonial, index) => {
          // Calculate the position relative to the current slide
          const position = (index - currentSlide + testimonials.length) % testimonials.length;
          let positionClass = '';
          
          if (position === 0) {
            positionClass = 'left-0 z-10';
          } else if (position === 1) {
            positionClass = 'left-1/2 transform -translate-x-1/2 z-20';
          } else {
            positionClass = 'right-0 z-10';
          }
          
          return (
            <div 
              key={testimonial.id} 
              className={`transition-all duration-500 absolute ${positionClass}`}
              style={{
                width: position === 1 ? '40%' : '30%',
                opacity: position === 1 ? 1 : 0.7
              }}
            >
              <TestimonialCard 
                {...testimonial} 
                isActive={position === 1}
              />
            </div>
          );
        })}
      </div>
      
      {/* Mobile Slider */}
      <div className="md:hidden">
        <motion.div 
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TestimonialCard 
            {...testimonials[currentSlide]} 
            isActive={true}
          />
        </motion.div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-center mt-6 md:hidden">
        <button 
          onClick={prevSlide}
          className="bg-white p-2 rounded-full shadow-md mx-2 hover:bg-gray-100"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="bg-white p-2 rounded-full shadow-md mx-2 hover:bg-gray-100"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Desktop Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="hidden md:block absolute left-1/4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-md z-30 hover:bg-gray-100"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="hidden md:block absolute right-1/4 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white p-2 rounded-full shadow-md z-30 hover:bg-gray-100"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export { TestimonialSlider, TestimonialCard }; 