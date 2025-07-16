import { useState, useCallback } from 'react';
import { UserInput } from '../types';
import { generateStreamingArchitecture } from '../api/mock-streaming';

interface StreamingChunk {
  type: 'node' | 'edge' | 'advantage' | 'value_prop' | 'complete';
  platform: 'cloudflare' | 'competitor';
  data: any;
  timestamp: number;
}

interface NodeData {
  id: string;
  type: string;
  name: string;
  subtitle?: string;
  position: { x: number; y: number };
  color: string;
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
  label?: string;
  color: string;
  style: 'solid' | 'dashed';
}

interface StreamingState {
  cloudflareNodes: NodeData[];
  competitorNodes: NodeData[];
  cloudflareEdges: EdgeData[];
  competitorEdges: EdgeData[];
  advantages: string[];
  valueProps: string[];
  isStreaming: boolean;
  isComplete: boolean;
  error: string | null;
}

export function useStreamingArchitecture() {
  const [state, setState] = useState<StreamingState>({
    cloudflareNodes: [],
    competitorNodes: [],
    cloudflareEdges: [],
    competitorEdges: [],
    advantages: [],
    valueProps: [],
    isStreaming: false,
    isComplete: false,
    error: null,
  });

  const generateArchitecture = useCallback(async (userInput: UserInput) => {
    // Reset state
    setState({
      cloudflareNodes: [],
      competitorNodes: [],
      cloudflareEdges: [],
      competitorEdges: [],
      advantages: [],
      valueProps: [],
      isStreaming: true,
      isComplete: false,
      error: null,
    });

    try {
      // Use mock streaming for local development
      const stream = await generateStreamingArchitecture(userInput);
      const reader = stream.getReader();

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setState(prev => ({ ...prev, isStreaming: false, isComplete: true }));
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunk: StreamingChunk = JSON.parse(line.slice(6));
              
              setState(prev => {
                const newState = { ...prev };

                switch (chunk.type) {
                  case 'node':
                    if (chunk.platform === 'cloudflare') {
                      newState.cloudflareNodes = [...prev.cloudflareNodes, chunk.data];
                    } else {
                      newState.competitorNodes = [...prev.competitorNodes, chunk.data];
                    }
                    break;

                  case 'edge':
                    if (chunk.platform === 'cloudflare') {
                      newState.cloudflareEdges = [...prev.cloudflareEdges, chunk.data];
                    } else {
                      newState.competitorEdges = [...prev.competitorEdges, chunk.data];
                    }
                    break;

                  case 'advantage':
                    newState.advantages = [...prev.advantages, chunk.data];
                    break;

                  case 'value_prop':
                    newState.valueProps = [...prev.valueProps, chunk.data];
                    break;

                  case 'complete':
                    newState.isStreaming = false;
                    newState.isComplete = true;
                    break;
                }

                return newState;
              });

            } catch (error) {
              console.warn('Failed to parse streaming chunk:', line, error);
            }
          }
        }
      }

    } catch (error) {
      console.error('Streaming error:', error);
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      cloudflareNodes: [],
      competitorNodes: [],
      cloudflareEdges: [],
      competitorEdges: [],
      advantages: [],
      valueProps: [],
      isStreaming: false,
      isComplete: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    generateArchitecture,
    reset,
  };
}