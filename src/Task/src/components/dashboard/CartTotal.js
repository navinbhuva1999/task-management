import React, { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import Button from '../ui/Button';

const CartTotal = ({ subtotal, savings, total, onCheckout }) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    setCouponCode('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <FiShoppingCart className="text-purple-light mr-2" size={20} />
        <h2 className="text-xl font-bold">Cart Total</h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-orange-100 p-3 text-orange-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 p-3 outline-none"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-purple-light text-white px-4 py-2 font-medium hover:bg-purple-dark transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Your save</span>
          <span className="font-medium">-${savings}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-purple-light">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <Button 
        onClick={onCheckout}
        fullWidth
        className="py-3 text-base font-medium"
      >
        Proceed To Checkout
      </Button>
    </div>
  );
};

export default CartTotal; 