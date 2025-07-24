import React from 'react';
import { motion } from 'framer-motion';

const CheckmarkItem = ({ title, description }) => {
  return (
    <motion.div 
      className="flex items-start"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-7 h-7 mr-3">
       <img src={"/images/check.svg"} alt="checkmark" className="w-full h-full" />
      </div>
      <div>
        <div className="text-gray-dark-80 text-xs sm:text-base font-semibold leading-relaxed w-[100%]">{description}</div>
      </div>
    </motion.div>
  );
};

export default CheckmarkItem; 