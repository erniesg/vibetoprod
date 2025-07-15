import React from 'react';

interface ConstraintsSelectorProps {
  selected: string[];
  onToggle: (constraint: string) => void;
  maxConstraints: number;
  isDarkMode: boolean;
}

const availableConstraints = [
  { id: 'Cost Optimization', icon: '💰' },
  { id: 'Global Performance', icon: '🌍' },
  { id: 'Enterprise Security', icon: '🔒' },
  { id: 'Developer Velocity', icon: '👨‍💻' },
  { id: 'Scalability', icon: '📈' }
];

export const ConstraintsSelector: React.FC<ConstraintsSelectorProps> = ({ 
  selected, 
  onToggle, 
  maxConstraints,
  isDarkMode
}) => {
  const canSelectMore = selected.length < maxConstraints;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Key Constraints
        </label>
        <span className={`text-xs font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {selected.length} of {maxConstraints} selected
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        {availableConstraints.map((constraint) => {
          const isSelected = selected.includes(constraint.id);
          const canSelect = canSelectMore || isSelected;
          
          return (
            <label
              key={constraint.id}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200
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
                onChange={() => canSelect && onToggle(constraint.id)}
                disabled={!canSelect}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-base">{constraint.icon}</span>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {constraint.id}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};