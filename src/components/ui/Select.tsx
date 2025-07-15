import React from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  isDarkMode?: boolean;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  options, 
  error, 
  isDarkMode = false,
  className,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={clsx(
            'appearance-none block w-full px-4 py-3 text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 relative z-50',
            isDarkMode 
              ? 'bg-gray-800 border-gray-600 text-white hover:border-gray-500 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400 placeholder-gray-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};