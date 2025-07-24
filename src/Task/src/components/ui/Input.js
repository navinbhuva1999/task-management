import React from 'react';

const Input = ({ 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  name, 
  id, 
  label,
  className = '',
  error,
  icon,
  ...props 
}) => {
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          name={name}
          id={id || name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-1 focus:ring-back focus:border-purple-dark 
            ${className} 
            ${error ? 'border-red-0' : ''}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-0">{error}</p>}
    </div>
  );
};

export default Input; 