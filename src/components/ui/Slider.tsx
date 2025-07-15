import React from 'react';
import { clsx } from 'clsx';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  isDarkMode?: boolean;
}

export const Slider: React.FC<SliderProps> = ({ 
  label, 
  description, 
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
      <input
        type="range"
        className={clsx(
          'w-full h-2 rounded-lg appearance-none cursor-pointer slider transition-all duration-200',
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
          className
        )}
        {...props}
      />
      {description && (
        <p className={`text-xs font-medium mt-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {description}
        </p>
      )}
    </div>
  );
};