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
    setCartItems([...cartItems, {...item, id: Date.now()}]);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const savings = 10; 
  const total = subtotal - savings;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center text-sm mb-6 text-gray-500">
        <Link to="/dashboard" className="flex items-center hover:text-purple-light transition-colors">
          <FiHome className="mr-1" />
          <span>Home</span>
        </Link>
        <span className="mx-2">/</span>
        <span className="flex items-center text-purple-light">
          <FiShoppingCart className="mr-1" />
          <span>Learning Cart</span>
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-6 animate-slide-in-left">
          <h2 className="text-2xl font-bold mb-6">Learning Cart</h2>
          
          {cartItems.length > 0 ? (
            <div>
              <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b text-gray-600 font-medium">
                <div className="col-span-5">Course</div>
                <div className="col-span-2">Tutor name</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Time</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-2 text-center">Remove</div>
              </div>
              
              <div className="space-y-4 mt-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>

              <div className="mt-8 space-y-4">
                {recommendedItems.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-200 rounded-lg animate-slide-in-up">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="bg-orange-100 h-16 w-16 rounded-lg flex items-center justify-center text-orange-light font-bold text-xl mr-4">
                        {item.title.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">Validity: {item.validity}</p>
                      </div>
                    </div>
                    <div className="flex items-center self-end md:self-auto">
                      <span className="font-medium mr-4">${item.price}</span>
                      <Button 
                        onClick={() => addToCart(item)} 
                        className="flex items-center"
                      >
                        <span className="mr-1">+</span> Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Browse courses and add them to your cart</p>
              <Link to="/dashboard/courses">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          )}
        </div>

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

      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default LearningCart; 