import React from 'react';
import { Zap, Users, Building } from 'lucide-react';
import { UserInput } from '../types';

interface PersonaSelectorProps {
  selected: UserInput['persona'];
  onSelect: (persona: UserInput['persona']) => void;
  isDarkMode: boolean;
}

const personas = [
  {
    id: 'Vibe Coder' as const,
    title: 'Vibe Coder',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500',
    selectedRing: 'ring-purple-500'
  },
  {
    id: 'FDE' as const,
    title: 'AI Engineer/Forward-Deployed Engineer',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    selectedRing: 'ring-blue-500'
  },
  {
    id: 'CIO/CTO' as const,
    title: 'CIO/CTO',
    icon: Building,
    gradient: 'from-orange-500 to-red-500',
    selectedRing: 'ring-orange-500'
  }
];

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selected, onSelect, isDarkMode }) => {
  return (
    <div className="flex justify-center space-x-8">
      {personas.map((persona) => {
        const Icon = persona.icon;
        const isSelected = selected === persona.id;
        
        return (
          <button
            key={persona.id}
            onClick={() => onSelect(persona.id)}
            className={`
              flex flex-col items-center space-y-3 p-4 rounded-xl transition-all duration-200
              ${isSelected 
                ? 'transform scale-110 shadow-lg' 
                : (isDarkMode 
                    ? 'hover:scale-105 hover:bg-gray-800'
                    : 'hover:scale-105 hover:bg-gray-50'
                  )
              }
            `}
          >
            <div className={`
              relative w-20 h-20 rounded-full bg-gradient-to-r ${persona.gradient} 
              flex items-center justify-center transition-all duration-200 shadow-lg
              ${isSelected ? `ring-4 ${persona.selectedRing} ring-offset-2` : ''}
            `}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <span className={`text-sm font-semibold ${
              isSelected 
                ? (isDarkMode ? 'text-white' : 'text-gray-900')
                : (isDarkMode ? 'text-gray-200' : 'text-gray-700')
            }`}>
              {persona.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};