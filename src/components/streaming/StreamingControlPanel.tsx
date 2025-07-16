import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PersonaSelector } from '../PersonaSelector';
import { CompetitorSelector } from '../CompetitorSelector';
import { ScaleSelector } from '../ScaleSelector';
import { ConstraintsSelector } from '../ConstraintsSelector';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { UserInput } from '../../types';

interface StreamingControlPanelProps {
  onGenerate: (input: UserInput) => void;
  loading: boolean;
  onPersonaChange: (persona: UserInput['persona']) => void;
  isDarkMode: boolean;
  currentPersona: UserInput['persona'];
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
    constraints: [],
    maxConstraints: 3
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

  const toggleConstraint = (constraint: string) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.includes(constraint)
        ? prev.constraints.filter(c => c !== constraint)
        : [...prev.constraints, constraint]
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
          Tell us about your project and we'll design the perfect Cloudflare solution
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
            onChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
            isDarkMode={isDarkMode}
          />

          <CompetitorSelector
            label="Compare Against"
            selected={formData.competitors}
            onSelect={handleCompetitorSelect}
            isDarkMode={isDarkMode}
          />
        </div>

        <div>
          <label className={`block text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Describe your application
          </label>
          <textarea
            data-testid="app-description"
            value={formData.appDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, appDescription: e.target.value }))}
            placeholder="e.g., A real-time chat application with AI-powered responses and file sharing capabilities"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-gray-600' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-50'
            }`}
            rows={4}
            required
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' 
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="font-medium">Advanced Options</span>
          {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showAdvanced && (
          <div className="space-y-6 pt-2">
            <ScaleSelector
              label="Expected Scale"
              selected={formData.scale}
              onChange={(scale) => setFormData(prev => ({ ...prev, scale }))}
              isDarkMode={isDarkMode}
            />

            <ConstraintsSelector
              label="Key Constraints"
              maxSelections={formData.maxConstraints}
              selected={formData.constraints}
              onToggle={toggleConstraint}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={!formData.appDescription.trim() || loading}
            loading={loading}
            className="w-full"
            data-testid="generate"
          >
            {loading ? 'Generating...' : 'Architect My App'}
          </Button>
        </div>
      </form>
    </div>
  );
};