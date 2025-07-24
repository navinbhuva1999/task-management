    import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  className = '', 
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#4E17A8] to-[#341C6E] text-white hover:opacity-90 focus:ring-purple-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
    outline: 'bg-transparent text-indigo-800 border border-indigo-800 hover:bg-indigo-50 focus:ring-indigo-500'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 