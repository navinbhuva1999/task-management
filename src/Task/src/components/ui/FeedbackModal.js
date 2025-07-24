import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { feedbackSchema } from '../../utils/validationSchema';
import { IoClose } from 'react-icons/io5';
import courseService from '../../services/api/courseService';

const FeedbackModal = ({ isOpen, onClose, tutor, onFeedbackSubmitted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: ''
    },
    validationSchema: feedbackSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const payload = {
          tutor_id: tutor?.id,
          rating: values.rating,
          comment: values.comment
        };

        await courseService.createFeedback(payload);
        toast.success('Feedback submitted successfully!');
        resetForm();
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
        onClose();
      } catch (error) {
        toast.error(error.message || 'Failed to submit feedback. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleRatingClick = (rating) => {
    formik.setFieldValue('rating', rating);
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
        duration: 0.2,
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

  if (!tutor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex bg-black-0 bg-opacity-70 items-center justify-center z-50 p-0 sm:p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={() => {
            onClose();
            formik.resetForm();
          }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 relative z-10 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="p-3 sm:p-6 pb-0 sm:pb-4">
              <div className="flex items-center justify-between bg-gray-dark-F6 rounded-2xl p-2 sm:p-3 gap-3 mb-1">
                <motion.div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-purple-gradient flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {tutor.profile_image ? (
                      <img
                        src={tutor.profile_image}
                        alt={tutor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm sm:text-lg">
                        {tutor.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex-1"
                  >
                    <div className="text-sm sm:text-base font-semibold text-black-0 mb-1">
                      Submit Your Feedback To {tutor.name}
                    </div>
                    <div className="text-gray-dark-80 text-xs font-semibold">Share your thoughts with us.</div>
                  </motion.div>
                </motion.div>
                <button
                  className="p-2 bg-white  rounded-full text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                  aria-label="Remove item"
                  onClick={() => {
                    onClose();
                    formik.resetForm();
                  }}
                >
                  <IoClose size={16} className='  transition-colors' />
                </button>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="px-6 pb-6">
              <motion.div
                className="mb-2 sm:mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className="text-4xl focus:outline-none p-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span
                        animate={{
                          color: star <= formik.values.rating ? "#FFC320" : "#D1D5DB"
                        }}
                        className='text-2xl sm:text-4xl'
                        transition={{ duration: 0.2 }}
                      >
                        ★
                      </motion.span>
                    </motion.button>
                  ))}
                </div>
                {formik.touched.rating && formik.errors.rating && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-0 text-xs text-center mt-1"
                  >
                    {formik.errors.rating}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <label htmlFor="comment" className="block text-xs sm:text-sm font-semibold mb-2 text-black-0">
                  Description
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`
                    w-full px-2 sm:px-4 py-1 text-xs sm:text-sm sm:py-2 border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-1 focus:ring-back focus:border-purple-dark 
                    ${formik.touched.comment && formik.errors.comment ? 'border-red-0' : ''}
                  `}
                  rows="3"
                  placeholder="Share your experience with this tutor (minimum 10 characters)..."
                />
                {formik.touched.comment && formik.errors.comment && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-0 text-xs mt-1"
                  >
                    {formik.errors.comment}
                  </motion.p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting || !formik.isValid || !formik.values.rating || !formik.values.comment.trim()}
                className={`w-full py-2 sm:py-3 rounded-full font-bold text-white transition-all duration-200 ${
                  isSubmitting || !formik.isValid || !formik.values.rating || !formik.values.comment.trim()
                    ? 'bg-gray-light-D3 cursor-not-allowed opacity-60'
                    : 'bg-purple-gradient hover:opacity-90'
                }`}
                whileHover={!isSubmitting && formik.isValid && formik.values.rating && formik.values.comment.trim() ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && formik.isValid && formik.values.rating && formik.values.comment.trim() ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <motion.div
                      className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Sending Feedback...
                  </div>
                ) : (
                  <div className="text-sm">
                    Send Feedback
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
