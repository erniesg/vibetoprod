import React from 'react';
import { UserInput } from '../types';

interface CompetitorSelectorProps {
  selected: UserInput['competitors'][0] | null;
  onSelect: (competitor: UserInput['competitors'][0]) => void;
  isDarkMode?: boolean;
}

const competitors = [
  { id: 'AWS' as const, name: 'AWS', logo: '🟠' },
  { id: 'GCP' as const, name: 'GCP', logo: '🔵' },
  { id: 'Azure' as const, name: 'Azure', logo: '🔷' },
  { id: 'Alibaba' as const, name: 'Alibaba', logo: '🟡' },
];

export const CompetitorSelector: React.FC<CompetitorSelectorProps> = ({ 
  selected, 
  onSelect, 
  isDarkMode = false 
}) => {
  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Compare Against
      </label>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {competitors.map((competitor) => {
          const isSelected = selected === competitor.id;
          
          return (
            <label
              key={competitor.id}
              className={`flex flex-col items-center space-y-1 cursor-pointer px-2 py-2 rounded-lg border transition-all duration-200 ${
                isSelected 
                  ? 'border-orange-500 shadow-sm' + (isDarkMode ? ' bg-orange-900/20' : ' bg-orange-50')
                  : (isDarkMode 
                      ? 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'
                      : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                    )
              }`}
            >
              <input
                type="radio"
                name="competitor"
                value={competitor.id}
                checked={isSelected}
                onChange={() => onSelect(competitor.id)}
                className="sr-only"
              />
              <span className="text-base">{competitor.logo}</span>
              <span className={`text-xs font-medium text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {competitor.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};