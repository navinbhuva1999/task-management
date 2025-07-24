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
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-stretch sm:justify-end p-4 sm:p-0">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black-0 bg-opacity-70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex w-full sm:justify-end">
        <div className="flex-grow hidden sm:block" />

        <div
          className={`
            bg-white relative overflow-y-auto 
            rounded-lg w-full max-w-sm max-h-[90vh]
            sm:max-w-md sm:max-h-none sm:h-screen sm:rounded-none
            animate-slide-in-bottom sm:animate-slide-in-right
          `}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-dark-F6 rounded-18px p-4 sm:p-5">
              <div className="flex items-center">
                {tutorData.image ? (
                  <img
                    src={tutorData.image}
                    alt={tutorData.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-orange-light bg-opacity-10 rounded-full p-4 text-orange-light">
                    <i className="icon icon-user text-gradient-orange text-xl" />
                  </div>
                )}
                <div className="ml-3 sm:ml-4">
                  <h2 className="text-sm sm:text-base font-bold text-black-0">Tutor Details</h2>
                  <p className="text-gray-dark-80 text-xs font-semibold">View comprehensive information about the tutor</p>
                </div>
              </div>
              <button
                className="p-2 bg-white rounded-full text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                aria-label="Close modal"
                onClick={onClose}
              >
                <IoClose size={16} />
              </button>
            </div>

            {/* Tutor Info */}
            <div className="space-y-3 sm:space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row justify-between">
                <span className="text-gray-dark-80 font-medium">Tutor name</span>
                <span className="text-black-0 font-medium">{tutorData.name || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between break-all">
                <span className="text-gray-dark-80 font-medium">Tutor email ID</span>
                <span className="text-black-0 font-medium">{tutorData.email || "-"}</span>
              </div>
              <div className="h-px w-full bg-gray-light-D5 opacity-40" />
              <div>
                <p className="text-black-0 font-bold mb-1">Description</p>
                <p className="text-gray-dark-80 font-medium leading-relaxed">
                  {tutorData.description || 'No description available'}
                </p>
              </div>

              {/* Social Share */}
              <div className="h-px bg-gray-light-D5 opacity-40" />
              <div>
                <p className="text-black-0 font-bold mb-3">Share Post</p>
                <div className="flex gap-2 flex-wrap">
                  {['facebook', 'x', 'instagram', 'linkdin'].map((icon) => (
                    <div
                      key={icon}
                      className="w-9 h-9 sm:w-8 sm:h-8 bg-gray-light-100 rounded-full flex items-center justify-center text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-transform transform hover:scale-110"
                    >
                      <i className={`icon icon-${icon} text-gradient-orange text-base`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="h-px bg-gray-light-D5 opacity-40" />
              <div>
                <p className="text-black-0 font-bold mb-3">Feedback</p>
                <div className="space-y-4 sm:space-y-5">
                  {tutorData.feedbacks.map((feedback, idx) => (
                    <motion.div
                      key={feedback.id}
                      className="p-3 sm:p-4 rounded-2xl bg-white shadow-sm hover:bg-gray-light-100 transition"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-gradient flex items-center justify-center overflow-hidden">
                          {feedback?.sender?.profile_image ? (
                            <img
                              src={feedback.sender.profile_image}
                              alt={feedback.sender.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-sm">
                              {feedback.sender?.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-black-0 text-sm">{feedback.sender?.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.span
                                  key={star}
                                  className={`text-sm sm:text-base ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-light-D3'}`}
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
                          <p className="text-gray-dark-100 text-sm mt-2 leading-relaxed">
                            {feedback.comment}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TutorDetailsModal;
