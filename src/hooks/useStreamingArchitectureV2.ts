import { useState, useCallback, useEffect } from 'react';
import { architectureResponseSchema } from '../schemas/architecture';
import type { UserInput } from '../types';
import type { z } from 'zod';

type ArchitectureResponse = z.infer<typeof architectureResponseSchema>;

export function useStreamingArchitectureV2() {
  const [object, setObject] = useState<Partial<ArchitectureResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugCount, setDebugCount] = useState(0);

  const generateArchitecture = useCallback(async (userInput: UserInput) => {
      
    setIsLoading(true);
    setError(null);
    setObject(null);
    setDebugCount(0);

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
              
              // Minimal debug: first 3 partial objects and final complete
              setDebugCount(prev => {
                const newCount = prev + 1;
                if (newCount <= 3) {
                  console.log(`📦 Partial ${newCount}:`, {
                    cfNodes: partialObject.cloudflare?.nodes?.length || 0,
                    cfEdges: partialObject.cloudflare?.edges?.length || 0,
                    compNodes: partialObject.competitor?.nodes?.length || 0,
                    compEdges: partialObject.competitor?.edges?.length || 0,
                    valueProps: partialObject.constraintValueProps?.length || 0
                  });
                }
                return newCount;
              });
              
              setObject(partialObject);
            } catch (parseError) {
              // Parse error - continue processing other chunks
            }
          }
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  // Log final complete object when streaming completes (only once)
  const isComplete = !isLoading && !!object;
  useEffect(() => {
    if (isComplete && object) {
      console.log('✅ Complete:', {
        cfNodes: object.cloudflare?.nodes?.length || 0,
        cfEdges: object.cloudflare?.edges?.length || 0,
        compNodes: object.competitor?.nodes?.length || 0,
        compEdges: object.competitor?.edges?.length || 0,
        valueProps: object.constraintValueProps?.length || 0
      });
    }
  }, [isComplete, object]);

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
    
    return isComplete;
  });
  
  // Debug disappearing nodes - minimal logging
  if (allCloudflareNodes.length > 0 && cloudflareNodes.length === 0) {
    console.warn('🐛 BUG: All Cloudflare nodes filtered out!', {
      rawCount: allCloudflareNodes.length,
      filteredCount: cloudflareNodes.length
    });
  }
  
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
  const allConstraintValueProps = object?.constraintValueProps || [];
  
  const constraintValueProps = allConstraintValueProps.filter(prop => {
    const isValid = prop && 
      typeof prop === 'object' && 
      prop.title && 
      prop.description && 
      prop.emoji;
    
    return isValid;
  });
  

  // Calculate completion status
  const isComplete = !isLoading && !!object;
  const hasData = cloudflareNodes.length > 0 || competitorNodes.length > 0;
  
  
  // Progress tracking
  const progress = {
    cloudflareNodes: cloudflareNodes.length,
    cloudflareEdges: cloudflareEdges.length,
    competitorNodes: competitorNodes.length,
    competitorEdges: competitorEdges.length,
    constraintValueProps: constraintValueProps.length,
    total: cloudflareNodes.length + cloudflareEdges.length + competitorNodes.length + competitorEdges.length + constraintValueProps.length
  };

  return {
    // Data
    cloudflareNodes,
    cloudflareEdges,
    competitorNodes,
    competitorEdges,
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