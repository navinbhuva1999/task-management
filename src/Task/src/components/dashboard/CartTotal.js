import React, { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import Button from '../ui/Button';

const CartTotal = ({ subtotal, savings, total, onCheckout }) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    setCouponCode('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-4 md:p-5 lg:p-6">
      <div className="flex items-center mb-6 sm:mb-4 md:mb-5">
        <FiShoppingCart className="text-purple-light mr-2 sm:mr-1.5 md:mr-2" size={20} />
        <h2 className="text-xl sm:text-lg md:text-xl font-bold">Cart Total</h2>
      </div>

      <div className="mb-6 sm:mb-4 md:mb-5">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-orange-100 p-3 sm:p-2 md:p-3 text-orange-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 p-3 sm:p-2 md:p-3 outline-none text-sm sm:text-xs md:text-sm"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-purple-light text-white px-4 py-2 sm:px-3 sm:py-1.5 md:px-4 md:py-2 font-medium text-sm sm:text-xs md:text-sm hover:bg-purple-dark transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-3 md:space-y-4 mb-6 sm:mb-4 md:mb-5">
        <div className="flex justify-between">
          <span className="text-gray-600 text-sm sm:text-xs md:text-sm">Subtotal</span>
          <span className="font-medium text-sm sm:text-xs md:text-sm">${subtotal}</span>
        </div>
        <div className="flex justify-between text-green-600 text-sm sm:text-xs md:text-sm">
          <span>Your save</span>
          <span className="font-medium">-${savings}</span>
        </div>
        <div className="flex justify-between text-lg sm:text-base md:text-lg font-bold text-purple-light">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        fullWidth
        className="py-3 sm:py-2.5 md:py-3 text-base sm:text-sm md:text-base font-medium"
      >
        Proceed To Checkout
      </Button>
    </div>
  );
};

export default CartTotal;
