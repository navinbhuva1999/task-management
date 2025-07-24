import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const PurchaseSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 } 
    }
  };

  const handleBackToHome = () => {
    navigate('/dashboard');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex bg-black-0 bg-opacity-70 items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-2xl w-full max-w-md mx-4 relative z-10 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="w-full h-full bg-[#FEF6F1]">
                <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                  <path d="M0 50H100M150 50H400M200 100H400M0 150H300M350 150H400M0 200H50M100 200H400M0 250H400" stroke="#E86C00" strokeOpacity="0.2" strokeWidth="1"/>
                  <path d="M50 0V300M100 0V300M150 0V300M200 0V300M250 0V300M300 0V300M350 0V300" stroke="#E86C00" strokeOpacity="0.2" strokeWidth="1"/>
                  <circle cx="50" cy="50" r="3" fill="#E86C00" fillOpacity="0.3"/>
                  <circle cx="150" cy="50" r="3" fill="#E86C00" fillOpacity="0.3"/>
                  <circle cx="200" cy="100" r="3" fill="#E86C00" fillOpacity="0.3"/>
                  <circle cx="300" cy="150" r="3" fill="#E86C00" fillOpacity="0.3"/>
                  <circle cx="350" cy="150" r="3" fill="#E86C00" fillOpacity="0.3"/>
                  <circle cx="50" cy="200" r="3" fill="#E86C00" fillOpacity="0.3"/>
                  <circle cx="100" cy="200" r="3" fill="#E86C00" fillOpacity="0.3"/>
                </svg>
              </div>
            </div>

            <div className="relative z-10 p-8 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-7"
              >
                <div className="bg-orange-500 rounded-full p-5 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold text-center text-black-0 mb-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Thank you for course purchase!
              </motion.h2>
              
              <motion.p 
                className="text-center text-gray-dark-80 text-sm font-medium mb-8 max-w-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                Thank you for purchasing the course! Your enrollment is confirmed, and you're all set to begin your learning journey. Check your dashboard for course details and upcoming sessions.
              </motion.p>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="w-full flex justify-center"
              >
                <button 
                  onClick={handleBackToHome}
                  className="py-2 px-6 bg-purple-gradient text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <FiArrowLeft />
                  Back To Home
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseSuccessModal; 