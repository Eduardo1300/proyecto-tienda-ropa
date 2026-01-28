import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  label,
  error,
  icon,
  fullWidth = true
}) => {
  const baseClasses = 'border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 dark:text-white bg-white dark:bg-gray-800';
  const errorClasses = error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : '';
  const iconPadding = icon ? 'pl-12' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconPadding} ${widthClass} ${className}`;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
