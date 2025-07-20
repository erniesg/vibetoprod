import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PersonaSelector } from '../PersonaSelector';
import { CompetitorSelector } from '../CompetitorSelector';
import { ScaleSelector } from '../ScaleSelector';
import { PrioritiesSelector } from '../PrioritiesSelector';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { UserInput } from '../../types';

interface StreamingControlPanelProps {
  onGenerate: (input: UserInput) => void;
  loading: boolean;
  onPersonaChange: (persona: UserInput['persona']) => void;
  isDarkMode: boolean;
  currentPersona: UserInput['persona'];
  hideTitle?: boolean;
}

export const StreamingControlPanel: React.FC<StreamingControlPanelProps> = ({ 
  onGenerate, 
  loading, 
  onPersonaChange, 
  isDarkMode, 
  currentPersona 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState<UserInput>({
    persona: 'Vibe Coder',
    region: 'Singapore',
    appDescription: '',
    competitors: ['AWS'],
    scale: 'Startup',
    priorities: [],
    maxPriorities: 3
  });

  // Sync internal persona state with auto-cycling
  useEffect(() => {
    setFormData(prev => ({ ...prev, persona: currentPersona }));
  }, [currentPersona]);

  const regionOptions = [
    { value: 'Singapore', label: '🇸🇬 Singapore' },
    { value: 'Tokyo', label: '🇯🇵 Tokyo' },
    { value: 'Sydney', label: '🇦🇺 Sydney' },
    { value: 'Mumbai', label: '🇮🇳 Mumbai' },
    { value: 'Seoul', label: '🇰🇷 Seoul' },
    { value: 'Hong Kong', label: '🇭🇰 Hong Kong' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      ...formData,
      competitors: formData.competitors.filter(c => c)
    });
  };

  const handleCompetitorSelect = (competitor: UserInput['competitors'][0]) => {
    setFormData(prev => ({
      ...prev,
      competitors: [competitor]
    }));
  };

  const togglePriority = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(c => c !== priority)
        : [...prev.priorities, priority]
    }));
  };

  const handlePersonaSelect = (persona: UserInput['persona']) => {
    setFormData(prev => ({ ...prev, persona }));
    onPersonaChange(persona);
  };

  return (
    <div className="space-y-8 w-full">
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Build Your Architecture
        </h2>
        <p className={`text-base ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Describe your project and AI will design the systems architecture for you
        </p>
      </div>

      <PersonaSelector
        selected={formData.persona}
        onSelect={handlePersonaSelect}
        isDarkMode={isDarkMode}
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Target Region"
            options={regionOptions}
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            isDarkMode={isDarkMode}
          />

          <CompetitorSelector
            selected={formData.competitors[0] || null}
            onSelect={handleCompetitorSelect}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Describe your application
          </label>
          <input
            type="text"
            placeholder="e.g., A high-traffic e-commerce platform with real-time inventory..."
            className={`w-full px-4 py-3 text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white hover:border-gray-500 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400 placeholder-gray-500'
            }`}
            value={formData.appDescription}
            onChange={(e) => setFormData({ ...formData, appDescription: e.target.value })}
            required
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-200 hover:text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Advanced Options</span>
          </button>

          {showAdvanced && (
            <div className={`mt-4 space-y-6 p-6 border rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <ScaleSelector
                selected={formData.scale}
                onSelect={(scale) => setFormData({ ...formData, scale })}
                isDarkMode={isDarkMode}
              />

              <PrioritiesSelector
                selected={formData.priorities}
                onToggle={togglePriority}
                maxPriorities={formData.maxPriorities}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={!formData.appDescription.trim() || formData.competitors.length === 0}
          className="w-full"
          isDarkMode={isDarkMode}
        >
          {loading ? 'Generating Architecture...' : 'Architect My App'}
        </Button>
      </form>
    </div>
  );
};