import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LoginConfirmationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleLogin = () => {
    navigate('/signin');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black-0 bg-opacity-80 flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-md relative z-10 overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-purple-gradient-light p-4 flex items-center border-b border-gray-200">
                <div className="bg-orange-light bg-opacity-20 p-2 rounded-full mr-3">
                  <FiAlertTriangle className="text-orange-light h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-black-0">Login Required</h3>
              </div>

              <div className="p-6">
                <p className="text-gray-dark-80 mb-6">
                  You need to be logged in to add this batch to your learning cart. Would you like to login now?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-light-D3 rounded-lg text-black-0 hover:bg-gray-50 transition-colors"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 bg-purple-light text-white rounded-lg hover:bg-purple-dark transition-colors"
                  >
                    Yes, Login
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginConfirmationModal; 