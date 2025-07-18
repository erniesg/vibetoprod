import { useState, useCallback } from 'react';
import { architectureResponseSchema } from '../schemas/architecture';
import type { UserInput } from '../types';
import type { z } from 'zod';

type ArchitectureResponse = z.infer<typeof architectureResponseSchema>;

export function useStreamingArchitectureV2() {
  const [object, setObject] = useState<Partial<ArchitectureResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateArchitecture = useCallback(async (userInput: UserInput) => {
    console.log('🚀 V2 Starting architecture generation:', userInput);
    
    setIsLoading(true);
    setError(null);
    setObject(null);

    try {
      const response = await fetch('/api/generate-architecture-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            appDescription: userInput.appDescription,
            persona: userInput.persona,
            constraints: userInput.constraints || [],
            competitors: userInput.competitors || ['AWS'],
            scale: userInput.scale || 'Startup',
            region: userInput.region || 'Global'
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsLoading(false);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              setIsLoading(false);
              break;
            }
            
            try {
              const partialObject = JSON.parse(dataStr);
              console.log('📦 V2 Streaming Chunk:', partialObject);
              
              // Debug constraintValueProps specifically
              if (partialObject.constraintValueProps && partialObject.constraintValueProps.length > 0) {
                console.log('🎯 CONSTRAINT VALUE PROPS RECEIVED:', partialObject.constraintValueProps);
              }
              
              setObject(partialObject);
            } catch (parseError) {
              console.warn('Failed to parse chunk:', dataStr);
            }
          }
        }
      }

    } catch (err) {
      console.error('🚨 V2 Streaming Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setObject(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Extract data with proper fallbacks and filter out incomplete objects
  const allCloudflareNodes = object?.cloudflare?.nodes || [];
  const cloudflareNodes = allCloudflareNodes.filter(node => {
    const isComplete = node && 
      typeof node === 'object' && 
      node.id && 
      node.type && 
      node.name && 
      node.position && 
      typeof node.position === 'object' && 
      typeof node.position.x === 'number' && 
      typeof node.position.y === 'number';
    
    if (!isComplete && node?.id) {
      console.log(`⏳ Incomplete node ${node.id}:`, node);
    }
    
    return isComplete;
  });
  const cloudflareEdges = (object?.cloudflare?.edges || []).filter(edge => 
    edge && 
    typeof edge === 'object' && 
    edge.id && 
    edge.from && 
    edge.to && 
    edge.label
  );
  const allCompetitorNodes = object?.competitor?.nodes || [];
  const competitorNodes = allCompetitorNodes.filter(node => 
    node && 
    typeof node === 'object' && 
    node.id && 
    node.type && 
    node.name && 
    node.position && 
    typeof node.position === 'object' && 
    typeof node.position.x === 'number' && 
    typeof node.position.y === 'number'
  );
  const competitorEdges = (object?.competitor?.edges || []).filter(edge => 
    edge && 
    typeof edge === 'object' && 
    edge.id && 
    edge.from && 
    edge.to && 
    edge.label
  );
  const advantages = (object?.cloudflare?.advantages || []).filter(advantage => 
    advantage && 
    typeof advantage === 'string' && 
    advantage.trim().length > 0
  );
  const allConstraintValueProps = object?.constraintValueProps || [];
  console.log('🔍 All constraintValueProps from object:', allConstraintValueProps);
  
  const constraintValueProps = allConstraintValueProps.filter(prop => {
    const isValid = prop && 
      typeof prop === 'object' && 
      prop.title && 
      prop.description && 
      prop.emoji;
    
    if (!isValid) {
      console.log('❌ Invalid constraintValueProp:', prop);
    }
    
    return isValid;
  });
  
  console.log('✅ Filtered constraintValueProps:', constraintValueProps);

  // Calculate completion status
  const isComplete = !isLoading && !!object;
  const hasData = cloudflareNodes.length > 0 || competitorNodes.length > 0;
  
  // Debug logging
  if (object && (cloudflareNodes.length > 0 || competitorNodes.length > 0)) {
    console.log(`🎯 Rendering: CF nodes: ${cloudflareNodes.length}/${allCloudflareNodes.length}, CF edges: ${cloudflareEdges.length}, Competitor nodes: ${competitorNodes.length}, Advantages: ${advantages.length}, Value props: ${constraintValueProps.length}`);
  }
  
  // Progress tracking
  const progress = {
    cloudflareNodes: cloudflareNodes.length,
    cloudflareEdges: cloudflareEdges.length,
    competitorNodes: competitorNodes.length,
    competitorEdges: competitorEdges.length,
    advantages: advantages.length,
    constraintValueProps: constraintValueProps.length,
    total: cloudflareNodes.length + cloudflareEdges.length + competitorNodes.length + competitorEdges.length + advantages.length + constraintValueProps.length
  };

  return {
    // Data
    cloudflareNodes,
    cloudflareEdges,
    competitorNodes,
    competitorEdges,
    advantages,
    valueProps: [], // Legacy compatibility
    constraintValueProps,
    
    // State
    isStreaming: isLoading,
    isComplete,
    hasData,
    progress,
    
    // Error handling
    error: error?.message || null,
    
    // Actions
    generateArchitecture,
    reset,
    
    // Raw object for debugging
    rawObject: object,
    
    // Comparison helpers
    isV2: true,
    version: '2.0.0'
  };
}

// Legacy compatibility wrapper
export function useStreamingArchitectureV2WithFallback() {
  const v2Hook = useStreamingArchitectureV2();
  
  // If V2 fails, we could fallback to V1 here
  // For now, just return V2 with fallback indicators
  return {
    ...v2Hook,
    fallbackAvailable: true,
    usingFallback: false
  };
}