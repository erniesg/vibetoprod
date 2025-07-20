import React, { useState } from 'react';
import { useStreamingArchitectureV2 } from '../../hooks/useStreamingArchitectureV2';
import type { UserInput } from '../../types';

export const StreamingV2Test: React.FC = () => {
  const [testInput] = useState<UserInput>({
    appDescription: 'Real-time gaming chat platform with voice channels',
    persona: 'Gaming Startup',
    priorities: ['Global Performance', 'Cost Optimization'],
    competitors: ['AWS'],
    scale: 'Startup',
    region: 'Global'
  });

  const {
    cloudflareNodes,
    cloudflareEdges,
    competitorNodes,
    competitorEdges,
    advantages,
    priorityValueProps,
    isStreaming,
    isComplete,
    hasData,
    progress,
    error,
    generateArchitecture,
    reset,
    rawObject
  } = useStreamingArchitectureV2();

  const handleTest = () => {
    generateArchitecture(testInput);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🚀 V2 Streaming Test (Vercel AI SDK)
        </h2>
        
        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleTest}
            disabled={isStreaming}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isStreaming ? 'Streaming...' : 'Test V2 Streaming'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Reset
          </button>
        </div>

        {/* Status */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <h4 className="font-semibold text-gray-700">Status</h4>
            <p className={`text-sm ${isStreaming ? 'text-blue-600' : isComplete ? 'text-green-600' : 'text-gray-500'}`}>
              {isStreaming ? 'Streaming...' : isComplete ? 'Complete' : 'Ready'}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h4 className="font-semibold text-gray-700">Progress</h4>
            <p className="text-sm text-gray-600">
              {progress.total} total items
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h4 className="font-semibold text-gray-700">Has Data</h4>
            <p className={`text-sm ${hasData ? 'text-green-600' : 'text-gray-500'}`}>
              {hasData ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-red-800 mb-2">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Data Display */}
        <div className="grid grid-cols-2 gap-6">
          {/* Cloudflare Data */}
          <div>
            <h3 className="text-lg font-semibold text-orange-600 mb-3">
              🔥 Cloudflare ({cloudflareNodes.length + cloudflareEdges.length})
            </h3>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-gray-700">Nodes ({cloudflareNodes.length})</h4>
                {cloudflareNodes.map((node, i) => (
                  <div key={i} className="text-sm text-gray-600 ml-2">
                    • {node.name} ({node.type})
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Edges ({cloudflareEdges.length})</h4>
                {cloudflareEdges.map((edge, i) => (
                  <div key={i} className="text-sm text-gray-600 ml-2">
                    • {edge.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Data */}
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-3">
              ⚫ Competitor ({competitorNodes.length + competitorEdges.length})
            </h3>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-gray-700">Nodes ({competitorNodes.length})</h4>
                {competitorNodes.map((node, i) => (
                  <div key={i} className="text-sm text-gray-600 ml-2">
                    • {node.name} ({node.type})
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Edges ({competitorEdges.length})</h4>
                {competitorEdges.map((edge, i) => (
                  <div key={i} className="text-sm text-gray-600 ml-2">
                    • {edge.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Value Props */}
        {priorityValueProps.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              💎 Value Propositions ({priorityValueProps.length})
            </h3>
            {priorityValueProps.map((prop, i) => (
              <div key={i} className="bg-green-50 p-3 rounded mb-2">
                <h4 className="font-medium text-green-800">{prop.emoji} {prop.title}</h4>
                <p className="text-sm text-green-700">{prop.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Advantages */}
        {advantages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">
              ⭐ Advantages ({advantages.length})
            </h3>
            {advantages.map((advantage, i) => (
              <div key={i} className="text-sm text-blue-700 ml-2">
                • {advantage}
              </div>
            ))}
          </div>
        )}

        {/* Debug Info */}
        {rawObject && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              🔍 Debug Raw Object
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(rawObject, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};