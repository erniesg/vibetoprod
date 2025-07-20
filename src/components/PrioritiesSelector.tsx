import React from 'react';
import { PRIORITY_MAPPINGS } from '../constants/priorities';

interface PrioritiesSelectorProps {
  selected: string[];
  onToggle: (priority: string) => void;
  maxPriorities: number;
  isDarkMode: boolean;
  hideLabel?: boolean;
}

const availablePriorities = Object.entries(PRIORITY_MAPPINGS).map(([id, mapping]) => ({
  id,
  icon: mapping.emoji,
  description: mapping.description
}));

export const PrioritiesSelector: React.FC<PrioritiesSelectorProps> = ({ 
  selected, 
  onToggle, 
  maxPriorities,
  isDarkMode,
  hideLabel = false
}) => {
  const canSelectMore = selected.length < maxPriorities;
  

  return (
    <div className="space-y-2">
      {!hideLabel && (
        <div className="flex items-center justify-between">
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Priorities
          </label>
          <span className={`text-xs font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {selected.length} of {maxPriorities} selected
          </span>
        </div>
      )}
      {hideLabel && (
        <div className="flex justify-end mb-2">
          <span className={`text-xs font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {selected.length} of {maxPriorities} selected
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        {availablePriorities.map((priority) => {
          const isSelected = selected.includes(priority.id);
          // Always allow deselecting. For selecting new: only if under limit
          const canSelect = isSelected || selected.length < maxPriorities;
          
          return (
            <label
              key={priority.id}
              className={`
                flex items-start space-x-3 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-orange-500 shadow-sm' + (isDarkMode ? ' bg-orange-900/20' : ' bg-orange-50')
                  : canSelect
                    ? (isDarkMode 
                        ? 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'
                        : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                      )
                    : (isDarkMode 
                        ? 'border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      )
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => canSelect && onToggle(priority.id)}
                disabled={!canSelect}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 mt-0.5"
              />
              <span className="text-base">{priority.icon}</span>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium block ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {priority.id}
                </span>
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {priority.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};