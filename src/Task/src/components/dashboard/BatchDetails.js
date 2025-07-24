import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ConfirmationModal, { AddToCartModal } from "../ui/ConfirmationModal";
import { useUser } from "../../context/UserContext";
import { formatDistanceToNow } from "date-fns";

const BatchDetails = ({
  batches = [],
  setIsPurchaseSuccessModalOpen,
  setShowFeedbackModal,
  setSelectedTutor,
  course,
}) => {
  const { user } = useUser();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBatch] = useState(batches.length > 0 ? batches[0] : null);
  const [feedbackScrollRef, setFeedbackScrollRef] = useState(null);

  useEffect(() => {
    if (feedbackScrollRef) {
      feedbackScrollRef.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [feedbackScrollRef]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePurchaseClick = () => {
    if (!user) {
      setShowPurchaseModal(true);
    } else {
      setIsPurchaseSuccessModalOpen(true);
    }
  };

  const handleWriteReview = (tutor) => {
    setSelectedTutor(tutor);
    setShowFeedbackModal(true);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: { delay: custom * 0.1, duration: 0.3 },
    }),
  };

  if (!batches || batches.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-18px shadow-sm border border-gray-light-D3 mr-5 my-5 p-6"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Batches Available
          </h3>
          <p className="text-gray-500 text-sm">
            Check back later for upcoming batches
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-white rounded-18px shadow-sm border border-gray-light-D3 mx-6 sm:mx-4 lg:mx-3 xl:mx-6 my-5"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div className="p-4 sm:p-3 md:p-4 lg:p-5">
          <div className="flex justify-between items-center mb-3 sm:mb-2 md:mb-3 lg:mb-4 border-b border-gray-light-D5 border-opacity-40 pb-2 sm:pb-1 md:pb-2">
            <h2 className="text-base sm:text-sm md:text-base lg:text-lg font-semibold text-black-0">
              Batch Details
            </h2>
            <motion.button
              onClick={handlePurchaseClick}
              className="py-1.5 px-3 sm:py-1 sm:px-2 md:py-1.5 md:px-3 lg:py-2 lg:px-3 bg-purple-gradient text-white text-xs sm:text-xs md:text-sm lg:text-sm rounded-full font-bold hover:bg-purple-dark transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Purchased
            </motion.button>
          </div>

          {selectedBatch && (
            <div className="space-y-2 sm:space-y-1 md:space-y-2">
              {[
                { label: "Batch name", value: selectedBatch.batch_name },
                { label: "Batch date", value: formatDate(selectedBatch.start_date) },
                { label: "Batch time", value: formatTime(selectedBatch.start_date) },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex justify-between items-center pb-0.5 sm:pb-0 md:pb-0.5 lg:pb-1"
                  variants={listItemVariants}
                  custom={idx}
                >
                  <span className="text-gray-dark-80 text-xs sm:text-xs md:text-sm lg:text-base font-medium">
                    {item.label}
                  </span>
                  <span className="text-black-0 text-xs sm:text-xs md:text-sm lg:text-base font-semibold">
                    {item.value}
                  </span>
                </motion.div>
              ))}

              {selectedBatch?.delivery_mode !== "OFFLINE" && (
                <motion.div
                  className="flex justify-between items-center pb-1 sm:pb-0.5 md:pb-1"
                  variants={listItemVariants}
                  custom={3}
                >
                  <span className="text-gray-dark-80 text-xs sm:text-xs md:text-sm lg:text-base font-medium">
                    Batch fee
                  </span>
                  <span className="text-black-0 text-xs sm:text-xs md:text-sm lg:text-base font-semibold">
                    ₹{selectedBatch.price}
                  </span>
                </motion.div>
              )}

              <motion.div className="pt-4 border-t border-gray-light-D5 border-opacity-40 mt-4 sm:pt-3 sm:mt-3 md:pt-4 md:mt-4" variants={listItemVariants} custom={4}>
                {selectedBatch?.delivery_mode !== "OFFLINE" && (
                  <motion.div>
                    <h3 className="text-black-0 text-xs sm:text-xs md:text-sm lg:text-base font-semibold mb-3 sm:mb-2 md:mb-3">
                      Join Link
                    </h3>
                    <motion.div
                      className="mb-3 sm:mb-2 md:mb-3 cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      onClick={() => window.open(selectedBatch.joining_url, "_blank")}
                    >
                      <div className="flex items-center gap-2 sm:gap-1 md:gap-2 p-3 sm:p-2 md:p-3 bg-gray-light-F8 rounded-lg border border-gray-light-D3">
                        <svg className="w-4 h-4 text-gray-dark-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <input
                          type="text"
                          value={selectedBatch.joining_url}
                          readOnly
                          className="flex-1 bg-transparent text-gray-dark-80 text-xs sm:text-xs md:text-sm focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {selectedBatch?.delivery_mode === "OFFLINE" && (
                  <motion.div>
                    <h3 className="text-black-0 text-sm sm:text-xs md:text-sm lg:text-base font-semibold mb-2 sm:mb-1 md:mb-2 lg:mb-3">
                      Address
                    </h3>
                    <motion.div className="mb-1 sm:mb-1 md:mb-2 lg:mb-3" whileHover={{ scale: 1.01 }}>
                      <div className="flex items-center gap-2 sm:gap-1 md:gap-2 p-3 sm:p-2 md:p-3 bg-gray-light-F8 rounded-lg border border-gray-light-D3">
                        <svg className="w-4 h-4 text-gray-dark-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-6.5 8-13a8 8 0 10-16 0c0 6.5 8 13 8 13z" />
                        </svg>
                        <div className="flex-1 bg-transparent text-gray-dark-80 text-xs sm:text-xs md:text-sm focus:outline-none line-clamp-2 break-words">
                          {selectedBatch?.address}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                <div className="space-y-2 sm:space-y-1 md:space-y-2">
                  {course?.active_addons?.map((addon) => (
                    <motion.button
                      key={addon.id}
                      className={`w-full py-3 sm:py-2 md:py-3 ${addon.title === "ATP Portal"
                        ? "bg-purple-gradient text-white"
                        : "bg-white border border-gray-light-D3 text-gray-dark-80"
                        } font-semibold rounded-lg hover:opacity-90 transition-opacity`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addon.addons_url && window.open(addon.addons_url, "_blank")}
                    >
                      {addon.title}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>


      {selectedBatch?.tutors?.length > 0 && (
        <motion.div
          className="bg-gray-50 rounded-18px p-4 sm:p-5 md:p-6 shadow-sm border border-gray-light-D3 mx-6 sm:mx-4 md:mx-5 lg:mx-6 mb-5"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.3 }}
        >
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-2 md:mb-3 lg:mb-4 border-b border-gray-light-D5 border-opacity-40 pb-2 sm:pb-1 md:pb-2">
              <h2 className="text-base sm:text-sm md:text-base lg:text-lg font-bold text-black-0">
                Feedback
              </h2>
            </div>

            <div
              className="space-y-4 sm:space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto pr-2"
              ref={setFeedbackScrollRef}
            >
              {selectedBatch.tutors.map((tutor, tutorIndex) => {
                const userFeedback = tutor.feedbacks?.find(
                  (fb) => fb.sender?.email === user?.email
                );

                return (
                  <motion.div
                    key={tutor.id}
                    className="space-y-2 sm:space-y-1 md:space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: tutorIndex * 0.1 }}
                  >
                    {userFeedback ? (
                      <motion.div
                        key={userFeedback.id}
                        className="flex flex-col gap-2 sm:gap-2 md:gap-3 p-3 sm:p-2 md:p-3 rounded-2xl box-shadow-sm shadow-gray-light-D3 shadow-sm bg-white hover:bg-gray-light-100 transition-colors duration-200"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: tutorIndex * 0.1 }}
                      >
                        <div className="flex gap-2 sm:gap-1 md:gap-2 lg:gap-3">
                          <div className="flex-shrink-0">
                            <motion.div
                              className="w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-purple-gradient flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                            >
                              {tutor.profile_image ? (
                                <img
                                  src={tutor.profile_image}
                                  alt={tutor.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-semibold text-sm sm:text-sm md:text-base lg:text-lg">
                                  {tutor.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </motion.div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-1 md:gap-2">
                              <div className="font-normal text-black-0 text-xs sm:text-xs md:text-sm lg:text-sm">
                                {tutor.name}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1 md:gap-2">
                              <div className="flex items-center gap-0.5 sm:gap-0.5 md:gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <motion.span
                                    key={star}
                                    className={`text-sm sm:text-sm md:text-base lg:text-lg ${star <= userFeedback.rating
                                        ? "text-yellow-400"
                                        : "text-gray-light-D3"
                                      }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 * star }}
                                  >
                                    ★
                                  </motion.span>
                                ))}
                              </div>
                              <span className="text-xs sm:text-xs md:text-sm font-medium text-black-0">
                                {userFeedback.rating}
                              </span>
                            </div>
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-dark-80">
                            {formatDistanceToNow(new Date(userFeedback?.created_at), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                        <div className="text-xs sm:text-xs md:text-sm text-gray-dark-100 leading-relaxed">
                          {userFeedback.comment}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 md:gap-3 justify-between p-2 sm:p-2 md:p-3 rounded-2xl box-shadow-sm shadow-gray-light-D3 shadow-sm bg-white hover:bg-gray-light-100 transition-colors duration-200"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-2 sm:gap-1 md:gap-2 lg:gap-3">
                          <motion.div
                            className="w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-purple-gradient flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                          >
                            {tutor.profile_image ? (
                              <img
                                src={tutor.profile_image}
                                alt={tutor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold text-sm sm:text-sm md:text-base lg:text-lg">
                                {tutor.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </motion.div>

                          <div className="font-normal text-black-0 text-xs sm:text-xs md:text-sm">
                            {tutor.name}
                          </div>
                        </div>

                        <motion.button
                          className="px-3 py-1.5 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-purple-gradient text-white text-xs sm:text-xs md:text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleWriteReview(tutor)}
                        >
                          Write A Review
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      <AddToCartModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        batchId={selectedBatch?.id}
        batchName={selectedBatch?.name}
      />
      <ConfirmationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type="payment"
        buttonText="Back To Home"
        buttonLink="/dashboard"
      />
    </>
  );
};

export default BatchDetails;