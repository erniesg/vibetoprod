import React, { useState } from 'react';
import { UserInput } from '../../types';
import { StreamingControlPanel } from './StreamingControlPanel';
import { StreamingReactFlow } from './StreamingReactFlow';
import { StreamingAdvantages } from './StreamingAdvantages';
import { useStreamingArchitecture } from './useStreamingArchitecture';

interface StreamingArchitectureDemoProps {
  isDarkMode: boolean;
  currentPersona: UserInput['persona'];
  onPersonaChange: (persona: UserInput['persona']) => void;
}

export const StreamingArchitectureDemo: React.FC<StreamingArchitectureDemoProps> = ({
  isDarkMode,
  currentPersona,
  onPersonaChange
}) => {
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);
  
  const {
    cloudflareNodes,
    cloudflareEdges,
    advantages,
    valueProps,
    isStreaming,
    isComplete,
    error,
    generateArchitecture,
    reset
  } = useStreamingArchitecture();

  const handleGenerate = async (input: UserInput) => {
    setCurrentInput(input);
    await generateArchitecture(input);
  };

  const hasData = cloudflareNodes.length > 0 || cloudflareEdges.length > 0;

  return (
    <>
      {/* Control Panel */}
      <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} py-12`}>
        <div className="px-8">
          <StreamingControlPanel 
            onGenerate={handleGenerate}
            loading={isStreaming}
            onPersonaChange={onPersonaChange}
            isDarkMode={isDarkMode}
            currentPersona={currentPersona}
          />
        </div>
      </section>

      {/* Results Section */}
      {(hasData || isStreaming) && (
        <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-12 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-8 space-y-8">
            {/* Section Header */}
            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {isStreaming ? 'Generating Architecture...' : 'Architecture Comparison'}
              </h2>
              <p className={`text-base ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isStreaming 
                  ? 'Watch as your architecture streams in real-time'
                  : 'See how Cloudflare stacks up against traditional solutions'
                }
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-700">Error: {error}</span>
                  <button
                    onClick={reset}
                    className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Streaming Progress */}
            {isStreaming && (
              <div className="text-center" data-testid="streaming-indicator">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-700">
                    Streaming architecture... ({cloudflareNodes.length} nodes, {cloudflareEdges.length} edges)
                  </span>
                </div>
              </div>
            )}

            {/* Diagrams Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StreamingReactFlow
                title="Cloudflare Architecture"
                nodes={cloudflareNodes}
                edges={cloudflareEdges}
                isStreaming={isStreaming}
                variant="cloudflare"
                isDarkMode={isDarkMode}
              />
              <StreamingReactFlow
                title="Traditional Architecture"
                nodes={[]} // TODO: Add competitor nodes
                edges={[]} // TODO: Add competitor edges
                isStreaming={false}
                variant="competitor"
                isDarkMode={isDarkMode}
                competitorName={currentInput?.competitors[0] || 'AWS'}
              />
            </div>
          </div>
        </section>
      )}

      {/* Advantages Section */}
      {(hasData || isStreaming) && (
        <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} py-12 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-8">
            <StreamingAdvantages
              advantages={advantages}
              valueProps={valueProps}
              isStreaming={isStreaming}
              isDarkMode={isDarkMode}
              persona={currentPersona}
              constraints={currentInput?.constraints || []}
              appDescription={currentInput?.appDescription || ""}
              competitor={currentInput?.competitors[0] || "AWS"}
            />
          </div>
        </section>
      )}

      {/* Completion marker for testing */}
      {isComplete && (
        <div data-testid="streaming-complete" className="hidden" />
      )}
    </>
  );
};