import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart } from 'react-icons/fi';
import Button from '../ui/Button';
import CartItem from './CartItem';
import CartTotal from './CartTotal';
import ConfirmationModal from '../ui/ConfirmationModal';

const LearningCart = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'PMP®: Project management professional (PMP)®',
      subtitle: 'The pmi construction professional (pmi-cp)™ certification is a globally recognized',
      image: '/images/Group 1376156601.svg',
      tutorName: 'Cameron williamson',
      tutorSubtitle: 'Jenny wilson',
      date: 'September 21, 2024',
      time: '00:02 AM',
      price: 100
    },
    {
      id: 2,
      title: 'Certified associate in project management (CAPM)®',
      subtitle: 'The pmi construction professional (pmi-cp)™ certification is a globally recognized',
      image: '/images/Group 1376156601.svg',
      tutorName: 'Cameron williamson',
      tutorSubtitle: 'Jenny wilson',
      date: 'September 21, 2024',
      time: '00:02 AM',
      price: 80
    },
    {
      id: 3,
      title: 'Certified associate in project management (CAPM)®',
      subtitle: 'The pmi construction professional (pmi-cp)™ certification is a globally recognized',
      image: '/images/Group 1376156601.svg',
      tutorName: 'Cameron williamson',
      tutorSubtitle: 'Jenny wilson',
      date: 'September 21, 2024',
      time: '00:02 AM',
      price: 80
    }
  ]);

  const [recommendedItems] = useState([
    {
      id: 4,
      title: 'lurnykxp',
      validity: '20 Days',
      price: 80
    },
    {
      id: 5,
      title: 'Atp portal',
      validity: '20 Days',
      price: 80
    }
  ]);

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    setCartItems([...cartItems, { ...item, id: Date.now() }]);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const savings = 10;
  const total = subtotal - savings;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6 text-gray-500 gap-1 sm:gap-2">
        <Link to="/dashboard" className="flex items-center hover:text-purple-light transition-colors">
          <FiHome className="mr-1" />
          <span>Home</span>
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="flex items-center text-purple-light">
          <FiShoppingCart className="mr-1" />
          <span>Learning Cart</span>
        </span>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6">
        {/* Cart Items Section */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 animate-slide-in-left">
          <h2 className="text-xl sm:text-xl md:text-2xl mb-4 sm:mb-5 md:mb-6">Learning Cart</h2>

          {cartItems.length > 0 ? (
            <div>
              {/* Header Row for larger screens */}
              <div className="hidden md:grid grid-cols-12 gap-3 sm:gap-4 py-2 sm:py-3 border-b text-gray-600 text-xs sm:text-sm font-medium">
                <div className="col-span-5">Course</div>
                <div className="col-span-2">Tutor name</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Time</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-2 text-center">Remove</div>
              </div>

              {/* Cart items */}
              <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>

              {/* Recommended items */}
              <div className="mt-6 sm:mt-7 md:mt-8 space-y-3 sm:space-y-4">
                {recommendedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg animate-slide-in-up gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-orange-100 h-12 w-12 sm:h-14 sm:w-14 rounded-lg flex items-center justify-center text-orange-light text-lg sm:text-xl">
                        {item.title.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Validity: {item.validity}</p>
                      </div>
                    </div>
                    <div className="flex items-center self-end sm:self-auto gap-2 sm:gap-3">
                      <span className="text-sm sm:text-base mr-1 sm:mr-2">${item.price}</span>
                      <Button
                        onClick={() => addToCart(item)}
                        className="flex items-center text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                      >
                        <span className="mr-1">+</span> Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🛒</div>
              <h3 className="text-lg sm:text-xl mb-1 sm:mb-2">Your cart is empty</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">Browse courses and add them to your cart</p>
              <Link to="/dashboard/courses">
                <Button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">Browse Courses</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Cart Total Section */}
        {cartItems.length > 0 && (
          <div className="lg:w-1/3 animate-slide-in-right">
            <CartTotal
              subtotal={subtotal}
              savings={savings}
              total={total}
              onCheckout={() => setIsModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default LearningCart;
