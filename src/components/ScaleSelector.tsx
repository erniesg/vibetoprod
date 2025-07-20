import React from 'react';
import { Slider } from './ui/Slider';
import { UserInput } from '../types';

interface ScaleSelectorProps {
  selected: UserInput['scale'];
  onSelect: (scale: UserInput['scale']) => void;
  isDarkMode: boolean;
}

const scaleOptions: UserInput['scale'][] = ['Startup', 'Growth', 'Enterprise', 'Global'];

export const ScaleSelector: React.FC<ScaleSelectorProps> = ({ selected, onSelect, isDarkMode }) => {
  const currentIndex = scaleOptions.indexOf(selected);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    onSelect(scaleOptions[index]);
  };

  return (
    <div className="space-y-2">
      <Slider
        isDarkMode={isDarkMode}
        min={0}
        max={3}
        step={1}
        value={currentIndex}
        onChange={handleSliderChange}
        description={`Current: ${selected} (${
          selected === 'Startup' ? '< 10K users' :
          selected === 'Growth' ? '10K - 100K users' :
          selected === 'Enterprise' ? '100K - 1M users' :
          '1M+ users'
        })`}
      />
    </div>
  );
};