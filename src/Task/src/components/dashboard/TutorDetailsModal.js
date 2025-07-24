import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const TutorDetailsModal = ({ isOpen, onClose, tutor }) => {
  if (!isOpen || !tutor) return null;

  const tutorData = {
    name: tutor.name,
    email: tutor.email,
    image: tutor.profile_image,
    description: tutor.description,
    ratings: tutor.ratings || [5, 5, 5, 5, 5],
    feedbacks: tutor.feedbacks?.length > 0 ? tutor.feedbacks : []
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:items-stretch sm:justify-end sm:p-0">
      <div
        className="fixed inset-0 bg-black-0 bg-opacity-70 transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="flex w-full sm:justify-end">
        <div className="flex-grow hidden sm:block"></div>
        
        <div className={`
          bg-white 
          relative 
          overflow-y-auto 
          rounded-lg
          /* Mobile: With margins and max height */
          w-full max-w-sm max-h-[90vh]
          sm:w-full sm:max-w-md sm:max-h-none sm:h-screen sm:rounded-none
          /* Mobile animation: slide from bottom, Desktop: slide from right */
          animate-slide-in-bottom
          sm:animate-slide-in-right
        `}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-6 bg-gray-dark-F6 rounded-18px p-4 justify-between">
              <div className='flex items-center'>
                {tutorData.image?.url || tutorData.image ? (
                  <img src={tutorData.image?.url || tutorData.image} alt={tutorData.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="bg-orange-light bg-opacity-10 rounded-full p-4 text-orange-light">
                    <i className='icon icon-user text-gradient-orange text-xl'></i>
                  </div>
                )}
                <div className="ml-4">
                  <h2 className="text-sm sm:text-base font-bold text-black-0">Tutor Details</h2>
                  <p className="text-gray-dark-80 text-xs font-semibold">View comprehensive information about the tutor</p>
                </div>
              </div>
              <button
                className="p-2 bg-white rounded-full text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                aria-label="Close modal"
                onClick={() => {
                  onClose();
                }}
              >
                <IoClose size={16} className='transition-colors' />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tutor Information */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <div className="text-gray-dark-80 font-medium text-sm">Tutor name</div>
                <div className="font-medium text-black-0 text-sm">{tutorData.name || "-"}</div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <div className="text-gray-dark-80 font-medium text-sm">Tutor email id</div>
                <div className="font-medium text-black-0 text-sm break-all sm:break-normal">{tutorData.email || "-"}</div>
              </div>
              
              <div className="h-px bg-gray-light-D5 w-full opacity-40"></div>
              
              <div>
                <div className="text-black-0 font-bold text-sm mb-2">Description</div>
                <div className="text-gray-dark-80 font-medium text-sm leading-relaxed">
                  {tutorData.description || 'No description available'}
                </div>
              </div>
              
              <div className="h-px bg-gray-light-D5 w-full opacity-40"></div>
              
              <div>
                <div className="text-black-0 font-bold text-sm mb-3">Share Post</div>
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 bg-gray-light-100 rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all transform hover:scale-110">
                    <i className='icon icon-facebook text-gradient-orange text-base'></i>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 bg-gray-light-100 rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all transform hover:scale-110">
                    <i className='icon icon-x text-gradient-orange text-base'></i>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 bg-gray-light-100 rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all transform hover:scale-110">
                    <i className='icon icon-instagram text-gradient-orange text-base'></i>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 bg-gray-light-100 rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all transform hover:scale-110">
                    <i className='icon icon-linkdin text-gradient-orange text-base'></i>
                  </div>
                </div>
              </div>
              
              <div className="h-px bg-gray-light-D5 w-full opacity-40"></div>
              
              <div>
                <div className="text-black-0 font-bold text-sm mb-3">Feedback</div>
                <div className="space-y-4 sm:space-y-6">
                  {tutor.feedbacks?.map((feedback, feedbackIndex) => (
                    <motion.div
                      key={feedback.id}
                      className="flex flex-col gap-3 p-3 sm:p-3 rounded-2xl box-shadow-sm shadow-gray-light-D3 shadow-sm bg-white hover:bg-gray-light-100 transition-colors duration-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (feedbackIndex * 0.05) }}
                    >
                      <div className='flex gap-3 flex-row items-center'>
                        <div className="flex-shrink-0">
                          <motion.div
                            className="w-10 h-10 rounded-full overflow-hidden bg-purple-gradient flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                          >
                            {feedback?.sender?.profile_image ? (
                              <img
                                src={feedback?.sender?.profile_image}
                                alt={feedback?.sender?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold text-lg">
                                {feedback?.sender?.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </motion.div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col">
                            <div className="font-bold text-black-0 text-sm">{feedback?.sender?.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <motion.span
                                    key={star}
                                    className={`text-base sm:text-lg ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-light-D3'}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 * star }}
                                  >
                                    ★
                                  </motion.span>
                                ))}
                              </div>
                              <span className="text-sm font-medium text-black-0">{feedback.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-px bg-gray-light-D5 w-full opacity-40"></div>
                      
                      <div className="text-sm text-gray-dark-100 font-semibold leading-relaxed">
                        {feedback.comment}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="h-4 sm:h-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TutorDetailsModal;