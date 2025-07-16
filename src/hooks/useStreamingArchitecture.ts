import { useState, useCallback } from 'react';
import { UserInput, DiagramShape, DiagramArrow } from '../types';
// Removed mock API import - using real Hono backend

interface StreamingChunk {
  type: 'node' | 'edge' | 'advantage' | 'value_prop' | 'constraint_value_prop' | 'complete';
  platform: 'cloudflare' | 'competitor';
  data: any;
  timestamp: number;
}

interface ConstraintValueProp {
  icon: string;
  emoji: string;
  title: string;
  description: string;
}

// Use existing types from the main application
type NodeData = DiagramShape;
type EdgeData = DiagramArrow;

interface StreamingState {
  cloudflareNodes: NodeData[];
  competitorNodes: NodeData[];
  cloudflareEdges: EdgeData[];
  competitorEdges: EdgeData[];
  advantages: string[];
  valueProps: string[];
  constraintValueProps: ConstraintValueProp[];
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
    constraintValueProps: [],
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
      constraintValueProps: [],
      isStreaming: true,
      isComplete: false,
      error: null,
    });

    try {
      // Make request to Hono backend
      const response = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();

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

                  case 'constraint_value_prop':
                    newState.constraintValueProps = [...prev.constraintValueProps, chunk.data];
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
      constraintValueProps: [],
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