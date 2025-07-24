import React, { useState, useEffect } from 'react';
import './LearningCartPage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cartService from '../../services/api/cartService';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import CheckoutModal from '../../components/ui/CheckoutModal';
import { IoClose } from 'react-icons/io5';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

const LearningCartPage = () => {
  const queryClient = useQueryClient();
  const [removeItemId, setRemoveItemId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['addons'] });
  }, [queryClient]);

  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCartItems,
  });

  const {
    data: addonsData,
    isLoading: isAddonsLoading,
    isError: isAddonsError
  } = useQuery({
    queryKey: ['addons'],
    queryFn: cartService.getAddons,
  });

  const removeCartItemMutation = useMutation({
    mutationFn: (id) => cartService.removeCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setIsConfirmModalOpen(false);
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      toast.error('Failed to remove item from cart');
    }
  });

  const addAddonToCartMutation = useMutation({
    mutationFn: (addonId) => cartService.addAddonToCart(addonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Addon added to cart');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add addon to cart');
    }
  });

  const applyCouponMutation = useMutation({
    mutationFn: (code) => cartService.applyCoupon(code),
    onSuccess: (data) => {
      toast.success('Coupon applied successfully');
      setCouponCode('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: (couponCode) => cartService.createOrder(couponCode),
    onSuccess: (data) => {
      setOrderDetails(data.data);
      setIsCheckoutModalOpen(true);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create order');
    }
  });

  const handleRemoveItem = (id) => {
    setRemoveItemId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmRemoveItem = () => {
    if (removeItemId) {
      removeCartItemMutation.mutate(removeItemId);
    }
  };

  const handleAddAddon = (addonId) => {
    addAddonToCartMutation.mutate(addonId);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    applyCouponMutation.mutate(couponCode.trim());
  };

  const handleCheckout = () => {
    const activeCouponCode = applyCouponMutation.data?.data?.coupon?.code || null;
    createOrderMutation.mutate(activeCouponCode);
  };

  const handleCouponInputChange = (e) => {
    setCouponCode(e.target.value);
  };

  const cartItems = cartData?.data || [];
  const addons = addonsData?.data || [];

  const addonIdsInCart = cartItems
    .filter(item => item.addon_id)
    .map(item => item.addon_id);

  const availableAddons = addons.filter(addon => !addonIdsInCart.includes(addon.id));

  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.batch?.price || item.addon?.price || 0);
    return total + price;
  }, 0);

  const appliedCoupon = applyCouponMutation.data?.data;

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;

  const finalAmount = appliedCoupon ? subtotal - discountAmount : subtotal;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  return (
    <div className="flex-1 py-4 overflow-auto bg-gray-light-300">
      <div className="sm:bg-white rounded-[18px] sm:shadow-sm overflow-hidden animate-fade-in  sm:border sm:border-gray-light-D3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 px-6">
          <h1 className="text-lg md:text-2xl font-bold text-black-0">Learning Cart</h1>
          <div className="flex items-center bg-white justify-between sm:justify-center border border-gray-light-D3 w-full mt-5 sm:mt-0 sm:w-auto rounded-full p-1.5 sm:p-1.5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleProfileClick}>
            <div className='flex items-center'>
              {user?.profile_image?.url ? (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                  <img
                    src={user?.profile_image?.url}
                    alt={user?.name || "User profile"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-orange-gradient flex items-center justify-center mr-2">
                  <i className='icon icon-user text-white text-sm' />
                </div>
              )}
              <div className="mr-2 mb-1 text-right block">
                <span className="text-sm font-medium text-gray-dark-200">{user?.name || "User"}</span>
              </div>
            </div>
            <div className='flex items-center'>
              <div className="h-4 w-px bg-gray-light-400 mx-1 hidden sm:block"></div>
              <button className="ml-2 text-black-0 ">
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        {
          !isCartLoading && cartItems.length === 0 && (
            <div className='w-full px-6'>
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <FiShoppingCart className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-black-0">Your cart is empty</h3>
                <p className="text-gray-500 mb-8 text-center max-w-md">Browse courses and add them to your cart</p>
                <Link to="/courses">
                  <button className="bg-purple-light text-white px-8 py-3 rounded-full hover:bg-purple-dark transition-colors">
                    Browse Courses
                  </button>
                </Link>
              </div>
            </div>
          )}
        {isCartLoading && (
          <div className="flex justify-center items-center h-64 px-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-light"></div>
          </div>
        )}
        {
          isCartError && (
            <div className="text-center py-10 px-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium mb-2">Failed to load cart items</h3>
              <p className="text-gray-500 mb-6">Please try again later</p>
            </div>
          )
        }
        <div className="flex flex-col lg:flex-row gap-6 px-6">
          <div className="lg:w-2/3 animate-slide-in-left border sm:border-none border-gray-light-D3 rounded-lg">
            {cartItems.length > 0 ? (
              <div className="overflow-x-auto scrollbar-hide mobile-scroll-container">
                  <div className="grid grid-cols-12 gap-4 py-3 bg-orange-gradient-light sm:rounded-lg text-black-0 font-medium px-4 min-w-[768px]">
                    <div className="col-span-5 text-sm sm:text-base font-medium text-center">Course</div>
                    <div className="col-span-2 text-sm sm:text-base font-medium">Tutor name</div>
                    <div className="col-span-2 text-sm sm:text-base font-medium">Date</div>
                    <div className="col-span-1 text-sm sm:text-base font-medium">Time</div>
                    <div className="col-span-1 text-sm sm:text-base font-medium">Price</div>
                    <div className="col-span-1 text-center text-sm sm:text-base font-medium">Remove</div>
                  </div>

                  <div className="space-y-4 min-w-[768px]">
                    {cartItems.map((item) => {
                    if (item.batch) {
                      const courseData = item.batch.course;
                      const tutorData = item.batch?.batch_tutor?.[0]?.tutor;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-12 gap-4 p-4 bg-white border border-gray-200 sm:rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="col-span-5 flex items-center">
                            <div className="sm:w-16 sm:h-16 w-12 h-12 bg-gray-100 rounded-lg mr-3 overflow-hidden flex-shrink-0">
                              {courseData?.course_image?.url ? (
                                <img
                                  src={courseData.course_image.url}
                                  alt={courseData.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/team-meeting.jpg";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-light font-bold text-xl">
                                  {courseData?.title?.charAt(0).toUpperCase() || 'C'}
                                </div>
                              )}
                            </div>
                            <div>
                              <Link
                                to={`/dashboard/cart/details/${courseData?.id || item.id}`}
                                className="font-medium text-sm sm:text-base text-black-0 hover:text-purple-light transition-colors"
                              >
                                {courseData?.title || 'Course Title Unavailable'}
                              </Link>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-5">
                                {item.batch?.batch_description || 'No description available'}
                              </p>
                            </div>
                          </div>

                          <div className="col-span-2 flex flex-col justify-center">
                            <p className="font-medium text-sm">{tutorData?.name || 'Unknown Tutor'}</p>
                            <p className="text-xs text-gray-500">{tutorData?.email || ''}</p>
                          </div>

                          <div className="col-span-2 flex items-center">
                            <span className="text-xs sm:text-sm">
                              {formatDate(item.batch.start_date)}
                            </span>
                          </div>

                          <div className="col-span-1 flex items-center">
                            <span className="text-xs sm:text-sm">
                              {formatTime(item.batch.start_date)}
                            </span>
                          </div>

                          <div className="col-span-1 flex items-center">
                            <span className="font-medium text-xs sm:text-sm">₹{item.batch?.price || 0}</span>
                          </div>

                          <div className="col-span-1 flex items-center justify-center">
                            <button
                              className="p-2 bg-gray-light-100 text-white rounded-full hover:bg-red-600 transition-colors"
                              aria-label="Remove item"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removeCartItemMutation.isPending}
                            >
                              <IoClose size={16} className='text-red-500 hover:text-white transition-colors' />
                            </button>
                          </div>
                        </motion.div>
                      );
                    } else if (item.addon) {
                      const addonData = item.addon;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-12 gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="col-span-4 flex items-center">
                            <div className="sm:w-16 sm:h-16 w-12 h-12  bg-orange-100 rounded-lg mr-3 overflow-hidden flex-shrink-0">
                              {addonData.addons_image?.url ? (
                                <img
                                  src={addonData.addons_image.url}
                                  alt={addonData.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/team-meeting.jpg";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-light font-bold text-xl">
                                  {addonData.title?.charAt(0).toUpperCase() || 'A'}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium  text-black-0">{addonData.title}</h3>
                            </div>
                          </div>


                          <div className="col-span-6 flex items-center">
                            <span className="text-sm font-medium bg-orange-100 text-orange-light px-2 py-1 rounded-full">
                              Validity: {addonData.validity} Days
                            </span>
                          </div>

                          <div className="col-span-1 flex items-center">
                            <span className="font-medium">₹{addonData.price || 0}</span>
                          </div>

                          <div className="col-span-1 flex items-center justify-center">
                            <button
                              className="p-2 bg-gray-light-100 text-white rounded-full hover:bg-red-600 transition-colors"
                              aria-label="Remove item"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removeCartItemMutation.isPending}
                            >
                              <IoClose size={16} className='text-red-500 hover:text-white transition-colors' />
                            </button>
                          </div>
                        </motion.div>
                      );
                    } else {
                      return null;
                    }
                    })}
                  </div>

                {!isAddonsLoading && !isAddonsError && availableAddons.length > 0 && (
                  <div className="sm:mt-8 mt-4 space-y-4 overflow-x-auto scrollbar-hide mobile-scroll-container min-w-[320px]">
                    <h2 className="text-lg font-semibold text-black-0 hidden sm:block">Available Addons</h2>
                    {availableAddons.map((addon, index) => (
                      <motion.div
                        key={addon.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex flex-row items-center justify-between p-4 border border-gray-200 rounded-lg min-w-[320px]"
                      >
                        <div className="flex items-center">
                          <div className="bg-orange-100 sm:h-16 sm:w-16 h-12 w-12 rounded-lg flex items-center justify-center text-orange-light font-bold text-xl mr-4">
                            {addon.addons_image?.url ? (
                              <img
                                src={addon.addons_image.url}
                                alt={addon.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/images/team-meeting.jpg";
                                }}
                              />
                            ) : (
                              addon.title.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">{addon.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-dark-80">Validity: {addon.validity} Days</p>
                          </div>
                        </div>
                        <div className="flex items-center self-end md:self-auto">
                          <span className="font-medium mr-4">₹{addon.price}</span>
                          <button
                            className="flex items-center bg-purple-light text-white px-4 py-2 rounded-md hover:bg-purple-dark transition-colors"
                            onClick={() => handleAddAddon(addon.id)}
                            disabled={addAddonToCartMutation.isPending}
                          >
                            <span className="mr-1">+</span> Add
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              null
            )}
          </div>

          {!isCartLoading && !isCartError && cartItems.length > 0 && (
            <div className="lg:w-1/3 animate-slide-in-right">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-light-D3">
                <div className="flex items-center mb-3 sm:mb-6 gap-2">
                  <i className='icon icon-cart text-gradient-orange text-xl' />
                  <h2 className="text-lg sm:text-xl font-bold text-black-0">Cart Total</h2>
                </div>

                <div className="flex items-center mb-6 border border-gray-light-D5 rounded-18px sm:p-2">
                  <div className="p-1 sm:p-2 rounded-full mt-1 light mr-2">
                    <i className='icon icon-coupon text-gradient-orange text-2xl' />
                  </div>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm"
                    value={couponCode}
                    onChange={handleCouponInputChange}
                    disabled={applyCouponMutation.isPending}
                  />
                  <button
                    className={`font-medium mr-2 underline text-xs sm:text-sm transition-colors ${couponCode.trim()
                      ? 'text-gradient-purple hover:text-purple-dark cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                      }`}
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || applyCouponMutation.isPending}
                  >
                    {applyCouponMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-purple-light border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>

                <div className="space-y-3 pb-4 ">
                  <div className="flex justify-between">
                    <span className="text-gray-dark-80 text-sm sm:text-base font-medium">Subtotal</span>
                    <span className="font-medium text-black-0 text-sm sm:text-base">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <AnimatePresence>
                    {appliedCoupon && (
                      <motion.div
                        className="flex justify-between"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          <span className="text-gray-dark-80 text-sm sm:text-base font-medium">
                            Your save
                            {appliedCoupon.coupon?.name && (
                              <span className="ml-1 text-xs bg-orange-100 text-orange-light px-2 py-0.5 rounded-full">
                                {appliedCoupon.coupon.name}
                              </span>
                            )}
                          </span>
                        </div>
                        <span className="font-medium text-red-0">-₹{discountAmount.toFixed(2)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-between mb-6 bg-gray-light-100 p-2 sm:p-4 rounded-18px">
                  <span className="font-medium text-base sm:text-lg text-black-0">Total</span>
                  <span className="font-bold text-base sm:text-lg text-green-600">₹{finalAmount.toFixed(2)}</span>
                </div>

                <button
                  className={`w-full py-2.5 rounded-18px text-sm sm:text-base font-medium transition-colors relative overflow-hidden ${createOrderMutation.isPending
                    ? 'bg-purple-light/70 text-white cursor-not-allowed'
                    : 'bg-purple-light text-white hover:bg-purple-dark'
                    }`}
                  onClick={handleCheckout}
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Proceed To Checkout'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmRemoveItem}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        type="danger"
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        orderDetails={orderDetails}
      />
    </div>
  );
};

export default LearningCartPage; 