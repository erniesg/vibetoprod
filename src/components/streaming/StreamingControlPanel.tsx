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

  return (
    <div className={`rounded-2xl shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Build Your Architecture
          </h2>
          <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Watch your architecture stream in real-time as AI generates the optimal Cloudflare solution
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Persona Selector */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Who are you building for?
            </label>
            <PersonaSelector
              selected={formData.persona}
              onChange={(persona) => {
                setFormData(prev => ({ ...prev, persona }));
                onPersonaChange(persona);
              }}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Region and App Description Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Primary region
              </label>
              <Select
                value={formData.region}
                onChange={(region) => setFormData(prev => ({ ...prev, region }))}
                options={regionOptions}
                placeholder="Select region"
                isDarkMode={isDarkMode}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Scale
              </label>
              <ScaleSelector
                selected={formData.scale}
                onChange={(scale) => setFormData(prev => ({ ...prev, scale }))}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* App Description */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Describe your application
            </label>
            <textarea
              data-testid="app-description"
              value={formData.appDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, appDescription: e.target.value }))}
              placeholder="e.g., A real-time chat application for remote teams with file sharing and AI-powered message summaries"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-gray-600' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-50'
              }`}
              rows={3}
              required
            />
          </div>

          {/* Advanced Options Toggle */}
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

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-6 pt-2">
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Compare against
                </label>
                <CompetitorSelector
                  selected={formData.competitors}
                  onChange={(competitors) => setFormData(prev => ({ ...prev, competitors }))}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Technical constraints (choose up to 3)
                </label>
                <ConstraintsSelector
                  selected={formData.constraints}
                  onChange={(constraints) => setFormData(prev => ({ ...prev, constraints }))}
                  maxSelections={formData.maxConstraints}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!formData.appDescription.trim() || loading}
              loading={loading}
              className="w-full"
              data-testid="generate"
            >
              {loading ? 'Streaming Architecture...' : 'Generate Architecture'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};