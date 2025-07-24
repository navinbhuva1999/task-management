import React from 'react';
import { useField } from 'formik';
import { FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parse, isValid } from 'date-fns';

const DatePickerField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  
  const getSelectedDate = () => {
    if (!field.value) return null;
    
    if (field.value instanceof Date && !isNaN(field.value)) {
      return field.value;
    }
    
    if (typeof field.value === 'string' && field.value.includes('-')) {
      try {
        const parsedDate = parse(field.value, 'dd-MM-yyyy', new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch (e) {
      }
    }
    
    const fallbackDate = new Date(field.value);
    return !isNaN(fallbackDate) ? fallbackDate : null;
  };
  
  return (
    <div className="sm:mb-6 mb-3 w-full">
      <label htmlFor={props.id || props.name} className="block text-sm font-semibold text-black-0 mb-1 sm:mb-2">
        {label}
      </label>
      <div className="relative w-full">
        <DatePicker
          {...field}
          {...props}
          selected={getSelectedDate()}
          onChange={(date) => helpers.setValue(date)}
          className="w-full bg-[#F6F6F6] !rounded-full px-4 py-3 text-gray-800 focus:ring-2 focus:ring-orange-light focus:outline-none transition-all pr-10"
          autoComplete="off"
          wrapperClassName="w-full"
          dateFormat="dd-MM-yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          // Remove problematic popperModifiers causing the error
          popperProps={{
            strategy: "fixed"
          }}
        />
        <div className="absolute right-4 top-3 text-gray-400 pointer-events-none">
          <FiCalendar />
        </div>
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default DatePickerField; 