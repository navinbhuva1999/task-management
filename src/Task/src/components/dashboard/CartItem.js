import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow animate-fade-in">
      <div className="md:col-span-5 flex items-center">
        <div className="w-16 h-16 bg-gray-100 rounded-lg mr-3 overflow-hidden flex-shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-light font-bold text-xl">
              {item.title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <Link to={`/dashboard/cart/details/${item.id}`} className="font-medium text-black-0 hover:text-purple-light transition-colors">
            {item.title}
          </Link>
          <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
        </div>
      </div>

      <div className="md:col-span-2 flex flex-col justify-center">
        <p className="font-medium text-sm">{item.tutorName}</p>
        <p className="text-xs text-gray-500">{item.tutorSubtitle}</p>
      </div>

      <div className="md:col-span-1 flex items-center">
        <span className="text-sm">{item.date}</span>
      </div>
      <div className="md:col-span-1 flex items-center">
        <span className="text-sm">{item.time}</span>
      </div>

      <div className="md:col-span-1 flex items-center">
        <span className="font-medium">${item.price}</span>
      </div>

      <div className="md:col-span-2 flex items-center justify-center">
        <button 
          onClick={() => onRemove(item.id)} 
          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem; 