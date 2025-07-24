import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRazorpay } from "react-razorpay";
import cartService from '../../services/api/cartService';
import { toast } from 'react-toastify';

const CheckoutModal = ({ isOpen, onClose, orderDetails }) => {
  const navigate = useNavigate();
  const {  Razorpay } = useRazorpay();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [paymentVerifying, setPaymentVerifying] = useState(false);

  useEffect(() => { 
    if (paymentStatus?.success) {
      const timer = setTimeout(() => {
        navigate('/dashboard/courses');
      }, 5000);
      
      const countdownInterval = setInterval(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [paymentStatus, navigate]);

  const handlePaymentVerification = async (paymentData) => {
    try {
      setPaymentVerifying(true);
      const response = await cartService.verifyPayment(paymentData);
      
      if (response.data.success) {
        const statusResponse = await cartService.getPaymentStatus(response.data.order_id);
        setPaymentStatus({
          ...response.data,
          order_status: statusResponse.data.order_status,
          payment_status: statusResponse.data.payment_status
        });
        toast.success('Payment successful!');
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment verification failed');
    } finally {
      setPaymentVerifying(false);
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!orderDetails) return;
    
    setIsLoading(true);
    
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_BDXl2bzhoK2Gxm',
      amount: orderDetails.amount || orderDetails.final_amount * 100, // Convert to paise if needed
      currency: orderDetails.currency || 'INR',
      name: 'PM Mentors',
      description: 'Course Purchase',
      image: '/images/main_logo.svg',
      order_id: orderDetails.order_id,
      handler: function(response) {
        handlePaymentVerification({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        });
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      notes: {
        address: 'PM Mentors Corporate Office'
      },
      theme: {
        color: '#7F56D9'
      },
      modal: {
        ondismiss: function() {
          setIsLoading(false);
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      
      rzp.on('payment.failed', function(response) {
        toast.error(response.error.description || 'Payment failed');
        setIsLoading(false);
      });
      
      rzp.open();
    } catch (error) {
      toast.error('Failed to initialize payment gateway');
      setIsLoading(false);
    }
  };

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
            className="bg-white rounded-2xl w-full max-w-sm sm:max-w-lg mx-4 relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
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

            <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6 sm:mb-7"
              >
                <div className="bg-orange-500 rounded-full p-4 sm:p-5 flex items-center justify-center">
                  {paymentStatus?.success ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                      <path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3746C6.51168 20.6274 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01L9 11.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                      <path d="M20 12V22H4V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 7H2V12H22V7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-xl sm:text-2xl font-bold text-center text-black-0 mb-3 sm:mb-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {paymentStatus?.success 
                  ? "Payment Successful!" 
                  : "Unlock your learning journey with confidence!"}
              </motion.h2>
              
              {orderDetails && !isLoading && !paymentStatus && (
                <motion.div
                  className="w-full mb-5 sm:mb-6 bg-white rounded-lg p-4 sm:p-5 border border-gray-light-D3 shadow-sm"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <div className="space-y-2 sm:space-y-3">
                    
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-dark-80">Original Amount:</span>
                      <span className="font-medium"> ₹{orderDetails.original_amount}</span>
                    </div>
                    
                    {orderDetails.discount_amount > 0 && (
                      <>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-dark-80">Discount</span>
                            {orderDetails.coupon && (
                              <span className="ml-1 text-xs bg-orange-100 text-orange-light px-1.5 sm:px-2 py-0.5 rounded-full">
                                {orderDetails.coupon.code}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-red-0">-₹{orderDetails.discount_amount}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-2 border-t border-gray-light-D3 flex justify-between">
                      <span className="font-semibold text-sm sm:text-base">Final Amount:</span>
                      <span className="font-bold text-green-600 text-sm sm:text-base">₹{orderDetails.final_amount}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {paymentStatus?.success && (
                <motion.div
                  className="w-full mb-5 sm:mb-6 bg-white rounded-lg p-4 sm:p-5 border border-gray-light-D3 shadow-sm"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <div className="space-y-2 sm:space-y-3">
                  
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-dark-80">Payment ID:</span>
                      <span className="font-medium text-xs sm:text-sm break-all">{paymentStatus.payment_id}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-dark-80">Order Status:</span>
                      <span className="font-medium text-green-600">{paymentStatus.order_status}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-dark-80">Payment Status:</span>
                      <span className="font-medium text-green-600">{paymentStatus.payment_status}</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <motion.p 
                className="text-center text-gray-dark-80 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 max-w-sm px-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: orderDetails ? 0.5 : 0.4, duration: 0.4 }}
              >
                {paymentStatus?.success 
                  ? `Thank you for your purchase! You'll be redirected to your courses in ${redirectCountdown} seconds...`
                  : paymentVerifying
                    ? "Verifying your payment..."
                    : "Complete your purchase to gain access to premium course materials, expert-led sessions, and a supportive learning community. Your professional growth starts here!"}
              </motion.p>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: orderDetails ? 0.6 : 0.5, duration: 0.4 }}
                className="w-full flex flex-col sm:flex-row gap-3 justify-center"
              >
                {paymentStatus?.success ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-light"></div>
                  </div>
                ) : isLoading || paymentVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-light"></div>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={onClose}
                      className="py-2.5 sm:py-3 px-6 sm:px-8 border border-gray-light-D3 text-black-0 font-medium text-xs sm:text-sm rounded-full hover:bg-gray-50 transition-colors"
                    >
                      No
                    </button>
                    <button 
                      onClick={handleContinue}
                      className="py-2.5 sm:py-3 px-6 sm:px-8 bg-purple-gradient text-white font-bold text-xs sm:text-sm rounded-full hover:opacity-90 transition-opacity"
                      disabled={!orderDetails}
                    >
                      Continue To Checkout
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal; 