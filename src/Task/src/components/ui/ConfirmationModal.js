import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import cartService from '../../services/api/cartService';
import { toast } from 'react-toastify';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning"
}) => {
  let iconColor = "text-yellow-500";
  let confirmBtnColor = "bg-yellow-500 hover:bg-yellow-600";
  let Icon = FiAlertTriangle;
  
  if (type === "danger") {
    iconColor = "text-red-500";
    confirmBtnColor = "bg-red-500 hover:bg-red-600";
  } else if (type === "info") {
    iconColor = "text-blue-500";
    confirmBtnColor = "bg-blue-500 hover:bg-blue-600";
  } else if (type === "success") {
    iconColor = "text-green-500";
    confirmBtnColor = "bg-green-500 hover:bg-green-600";
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      } 
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { 
        duration: 0.2
      } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black-0 bg-opacity-70 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-center">
                <div className={`mr-4 ${iconColor}`}>
                  <Icon size={24} />
                </div>
                <p className="text-gray-700">{message}</p>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 rounded-md text-white ${confirmBtnColor} transition-colors`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AddToCartModal = ({ isOpen, onClose, batchId, batchName }) => {
  const navigate = useNavigate();
  
  const addToCartMutation = useMutation({
    mutationFn: (batchId) => cartService.addBatchToCart(batchId),
    onSuccess: () => {
      toast.success('Batch added to cart successfully!');
      navigate('/dashboard/cart');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add batch to cart');
      onClose();
    }
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate(batchId);
  };

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
                  <FiShoppingCart className="text-orange-light h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-black-0">Add to Learning Cart</h3>
              </div>

              <div className="p-6">
                <p className="text-gray-dark-80 mb-6">
                  Are you sure you want to add <span className="font-bold text-black-0">{batchName || "this batch"}</span> to your learning cart?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-light-D3 rounded-lg text-black-0 hover:bg-gray-50 transition-colors"
                    disabled={addToCartMutation.isPending}
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-purple-light text-white rounded-lg hover:bg-purple-dark transition-colors flex items-center"
                    disabled={addToCartMutation.isPending}
                  >
                    {addToCartMutation.isPending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Yes, Add to Cart'
                    )}
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

export default ConfirmationModal; 