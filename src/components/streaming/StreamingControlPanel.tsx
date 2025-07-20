import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PersonaSelector } from '../PersonaSelector';
import { CompetitorSelector } from '../CompetitorSelector';
import { ScaleSelector } from '../ScaleSelector';
import { PrioritiesSelector } from '../PrioritiesSelector';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { UserInput } from '../../types';
import { personaPresets } from '../../constants/personaPresets';

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
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [originalPresetData, setOriginalPresetData] = useState<any>(null);
  const [formData, setFormData] = useState<UserInput>({
    persona: 'Vibe Coder',
    region: 'Singapore',
    appDescription: '',
    competitors: ['AWS'],
    scale: 'Startup',
    priorities: [],
    maxPriorities: 3
  });

  // Load from session storage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('vibetoprod_form_data');
    const savedPreset = sessionStorage.getItem('vibetoprod_selected_preset');
    const savedOriginal = sessionStorage.getItem('vibetoprod_original_preset');
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({ ...prev, ...parsed, persona: currentPersona }));
    }
    if (savedPreset) {
      setSelectedPreset(savedPreset);
    }
    if (savedOriginal) {
      setOriginalPresetData(JSON.parse(savedOriginal));
    }
  }, []);

  // Sync internal persona state with auto-cycling (but keep preset selection)
  useEffect(() => {
    setFormData(prev => ({ ...prev, persona: currentPersona }));
  }, [currentPersona]);

  // Save to session storage whenever form data changes
  useEffect(() => {
    sessionStorage.setItem('vibetoprod_form_data', JSON.stringify({
      appDescription: formData.appDescription,
      scale: formData.scale,
      priorities: formData.priorities,
      region: formData.region,
      competitors: formData.competitors
    }));
  }, [formData]);

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

  const handlePresetSelect = (presetLabel: string) => {
    if (!presetLabel) {
      setSelectedPreset('');
      setOriginalPresetData(null);
      sessionStorage.removeItem('vibetoprod_selected_preset');
      sessionStorage.removeItem('vibetoprod_original_preset');
      return;
    }

    // Find preset across all personas to support cross-persona templates
    let preset = null;
    for (const persona of Object.keys(personaPresets) as Array<keyof typeof personaPresets>) {
      preset = personaPresets[persona]?.find(p => p.label === presetLabel);
      if (preset) break;
    }

    if (preset) {
      setFormData(prev => ({
        ...prev,
        appDescription: preset.appDescription,
        scale: preset.scale,
        priorities: preset.priorities
      }));
      setSelectedPreset(presetLabel);
      setOriginalPresetData(preset);
      
      // Save to session storage
      sessionStorage.setItem('vibetoprod_selected_preset', presetLabel);
      sessionStorage.setItem('vibetoprod_original_preset', JSON.stringify(preset));
    }
  };

  // Check if current values differ from original preset
  const getModificationStatus = () => {
    if (!originalPresetData) return { modified: false };
    
    const appModified = formData.appDescription !== originalPresetData.appDescription;
    const scaleModified = formData.scale !== originalPresetData.scale;
    const prioritiesModified = JSON.stringify(formData.priorities?.sort()) !== JSON.stringify(originalPresetData.priorities?.sort());
    
    return {
      modified: appModified || scaleModified || prioritiesModified,
      appModified,
      scaleModified,
      prioritiesModified
    };
  };

  // Don't clear preset selection when user types - just show modification status
  const handleAppDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, appDescription: value }));
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
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Describe your application
            </label>
            <select 
              value={selectedPreset}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className={`text-xs px-2 py-1 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <option value="">Templates ↓</option>
              {Object.entries(personaPresets).map(([persona, presets]) => (
                <optgroup key={persona} label={persona}>
                  {presets.map(preset => (
                    <option key={preset.label} value={preset.label}>
                      {preset.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="e.g., A high-traffic e-commerce platform with real-time inventory..."
            className={`w-full px-4 py-3 text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white hover:border-gray-500 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400 placeholder-gray-500'
            }`}
            value={formData.appDescription}
            onChange={(e) => handleAppDescriptionChange(e.target.value)}
            required
          />
          {selectedPreset && (
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Using template: <span className="font-medium">{selectedPreset}</span>
              {getModificationStatus().modified && <span className="text-orange-500 ml-1">*</span>}
            </p>
          )}
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
              <div>
                <div className="flex items-center mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Scale
                  </span>
                  {getModificationStatus().scaleModified && (
                    <span className="text-orange-500 ml-1 text-xs">*</span>
                  )}
                </div>
                <ScaleSelector
                  selected={formData.scale}
                  onSelect={(scale) => setFormData({ ...formData, scale })}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Priorities
                  </span>
                  {getModificationStatus().prioritiesModified && (
                    <span className="text-orange-500 ml-1 text-xs">*</span>
                  )}
                </div>
                <PrioritiesSelector
                  selected={formData.priorities}
                  onToggle={togglePriority}
                  maxPriorities={formData.maxPriorities}
                  isDarkMode={isDarkMode}
                  hideLabel={true}
                />
              </div>
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