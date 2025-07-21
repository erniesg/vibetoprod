---
title: "How I Built This: Streaming Generated Systems Architecture Design Diagrams in Real-time With Cloudflare Workers x Vercel AI SDK"
description: "Building a real-time architecture diagram generator that streams complex structured data as AI models generate it, node by node, edge by edge."
publishDate: "2024-12-19"
tags: ["ai", "streaming", "cloudflare", "vercel", "architecture", "real-time"]
author: "vibetoprod"
---

# How I Built This: Streaming Generated Systems Architecture Design Diagrams in Real-time With Cloudflare Workers x Vercel AI SDK

*Building a real-time architecture diagram generator that streams complex structured data as AI models generate it, node by node, edge by edge.*

## The Problem: Beyond Text Streaming

Most AI streaming implementations focus on text generation—think ChatGPT's typewriter effect. But what if you need to stream complex, structured data in real-time? What if you want to visualize a network diagram as an AI model generates it, node by node, edge by edge?

That's exactly what we tackled while building **vibetoprod**, a tool that generates interactive cloud architecture comparisons. Instead of waiting 10+ seconds for a complete response, we wanted users to see diagrams materialize in real-time as the AI thinks.

## Our Stack: Edge-First Streaming

Here's our modern, edge-optimized stack:

**Backend:**
- **Cloudflare Workers** - Edge compute for global low-latency
- **Hono** - Lightweight web framework (like Express for Workers)
- **Vercel AI SDK** - The secret sauce for structured streaming
- **OpenAI GPT-4** - Our architecture brain
- **Zod** - Runtime schema validation

**Frontend:**
- **React + TypeScript** - Type-safe UI components
- **React Flow** - Interactive diagram visualization
- **Server-Sent Events** - Real-time browser streaming

## The Magic: `partialObjectStream`

The breakthrough came from Vercel AI SDK's `partialObjectStream`. While most developers know about `streamText()`, fewer know about `streamObject()` - and even fewer about its partial streaming capabilities.

Here's how it works:

### 1. Define Your Schema

```typescript
// src/schemas/architecture.ts
import { z } from 'zod';

const diagramNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  subtitle: z.string().optional(),
  position: z.object({
    x: z.number().default(0),
    y: z.number().default(0)
  }).optional().default({ x: 0, y: 0 }),
  color: z.string().optional(),
});

export const architectureResponseSchema = z.object({
  cloudflare: z.object({
    nodes: z.array(diagramNodeSchema),
    edges: z.array(diagramEdgeSchema),
    advantages: z.array(z.string())
  }),
  competitor: z.object({
    nodes: z.array(diagramNodeSchema),
    edges: z.array(diagramEdgeSchema)
  }),
  priorityValueProps: z.array(priorityValuePropSchema)
    .describe('Priority-specific value propositions with metrics')
});
```

### 2. Backend: Stream Partial Objects

```typescript
// functions/services/modernOpenAIService.ts
import { streamObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export class ModernOpenAIService {
  private model: any;
  
  constructor(private apiKey: string) {
    const openai = createOpenAI({
      apiKey: this.apiKey
    });
    this.model = openai('gpt-4o-2024-08-06');
  }

  async streamArchitecture(input: UserInput) {
    const prompt = this.buildPrompt(input);

    return await streamObject({
      model: this.model,
      schema: architectureResponseSchema,
      prompt,
      mode: 'json'
    });
  }
}
```

### 3. Cloudflare Workers: Server-Sent Events

```typescript
// functions/[[route]].ts
app.post('/api/generate-architecture-v2', async (c) => {
  const userInput = await c.req.json();
  const modernOpenAI = new ModernOpenAIService(c.env.OPENAI_API_KEY);
  const result = await modernOpenAI.streamArchitecture(userInput);
  
  // Stream partial objects as Server-Sent Events
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // This is where the magic happens
      for await (const partialObject of result.partialObjectStream) {
        const chunk = `data: ${JSON.stringify(partialObject)}\n\n`;
        controller.enqueue(encoder.encode(chunk));
      }
      
      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
```

## The Frontend Challenge: Partial Objects Are Messy

Here's where it gets interesting. The AI doesn't send complete objects—it sends **partial objects** that build up over time:

```json
// First chunk
{
  "cloudflare": {
    "nodes": [
      { "id": "workers" }
    ]
  }
}

// Second chunk  
{
  "cloudflare": {
    "nodes": [
      { 
        "id": "workers",
        "type": "workers",
        "name": "Workers"
      }
    ]
  }
}

// Third chunk
{
  "cloudflare": {
    "nodes": [
      { 
        "id": "workers",
        "type": "workers", 
        "name": "Workers",
        "subtitle": "Serverless Functions",
        "position": { "x": 100, "y": 200 }
      }
    ]
  }
}
```

### 4. Auto-Layout: Real-Time Dagre Positioning

One key insight: **don't ask the AI to handle layout**. LLMs are terrible at spatial positioning, but great at generating logical relationships. Instead, we:

1. Generate nodes with `position: { x: 0, y: 0 }` (ignored)
2. Re-run Dagre layout on every streaming update
3. Auto-fit the viewport as the diagram grows

```typescript
// src/utils/autoLayout.ts
import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

const nodeWidth = 172;
const nodeHeight = 50;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  if (nodes.length === 0) return { nodes: [], edges };
  
  // Create fresh graph for each layout (no shared state)
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 150,  // Space between nodes on same rank
    ranksep: 200,  // Space between ranks (layers) 
    marginx: 80,   // Graph margin
    marginy: 80
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};
```

The magic happens in the streaming component—layout recalculates **on every node addition**:

```typescript
// src/components/streaming/StreamingReactFlow.tsx
useEffect(() => {
  if (reactFlowNodes.length > 0) {
    // Re-layout on every streaming update
    const { nodes: layoutedNodesResult, edges: layoutedEdgesResult } = getLayoutedElements(
      reactFlowNodes, 
      reactFlowEdges,
      'LR'  // Left-to-right layout
    );
    
    setLayoutedNodes(layoutedNodesResult);
    setLayoutedEdges(layoutedEdgesResult);
    
    // Auto-fit viewport to new layout
    setTimeout(() => {
      if (reactFlowInstanceRef.current) {
        reactFlowInstanceRef.current.fitView({ padding: 0.2 });
      }
    }, 50);
  }
}, [reactFlowNodes.length, reactFlowEdges.length]); // Re-run on every count change
```

This approach gives you **responsive, real-time layout**: as each node streams in, Dagre recalculates the entire layout and the viewport adjusts smoothly. **AI generates logical architecture, Dagre handles visual perfection**.

### 5. Frontend: Graceful Partial Object Handling

```typescript
// src/hooks/useStreamingArchitectureV2.ts
export function useStreamingArchitectureV2() {
  const [object, setObject] = useState<Partial<ArchitectureResponse> | null>(null);
  
  // Filter out incomplete objects before rendering
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
  
  // Stream processing
  const generateArchitecture = useCallback(async (userInput: UserInput) => {
    const response = await fetch('/api/generate-architecture-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: userInput }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          if (dataStr === '[DONE]') break;
          
          try {
            const partialObject = JSON.parse(dataStr);
            setObject(partialObject); // React re-renders with new data
          } catch (parseError) {
            console.warn('Failed to parse chunk:', dataStr);
          }
        }
      }
    }
  }, []);

  return {
    cloudflareNodes, // Only complete nodes
    // ... other filtered data
    generateArchitecture,
  };
}
```

## Key Learnings: What We Discovered

### 1. **Partial Objects Arrive Incrementally**
The AI model doesn't complete one node before starting another. It might send Node A with just an ID, then Node B with partial data, then complete Node A. Your frontend must handle this gracefully.

### 2. **Validation is Critical**
Always validate partial objects before rendering. Missing required fields will crash React Flow. Better to skip incomplete objects than crash the UI.

### 3. **Separate AI Logic from Visual Layout**
Don't ask LLMs to calculate positions—they're bad at spatial reasoning. Let AI generate the logical architecture, then use Dagre.js for automatic layout. This gives you clean, properly spaced diagrams.

### 4. **Server-Sent Events > WebSockets**
For one-way streaming, SSE is simpler than WebSockets. No connection management, automatic reconnection, and better browser support.

### 5. **Cloudflare Workers Are Streaming-Friendly**
Workers handle streaming surprisingly well. The `ReadableStream` API works perfectly with Vercel AI SDK's `partialObjectStream`.

### 6. **Progressive Rendering Creates Better UX**
Users love seeing diagrams build up in real-time. It feels more interactive than a loading spinner, even if the total time is the same.

## The Result: Real-Time Architecture Visualization

What we built is a system that:
- Streams complex, structured data in real-time
- Handles partial objects gracefully
- Provides immediate visual feedback
- Scales globally via Cloudflare's edge network
- Maintains type safety throughout the pipeline

The user clicks "Generate Architecture" and immediately sees nodes and connections appear as the AI thinks. It's like watching an architect sketch a blueprint in real-time.

## Try It Yourself

The core pattern is simple:
1. Use Vercel AI SDK's `streamObject()` with `partialObjectStream`
2. Stream via Server-Sent Events
3. Filter incomplete objects on the frontend
4. Render progressively as objects complete

This approach works for any structured data: database schemas, API responses, configuration files, or complex visualizations.

## What This Means for Hyperpersonalized UI on the Edge

This streaming architecture pattern unlocks something bigger: **hyperpersonalized interfaces that adapt in real-time**.

Imagine interfaces that don't just load faster—they *evolve* as they load, tailored to each user's context:

- **Dashboard widgets** that appear based on your current project state
- **Navigation menus** that reorganize based on your usage patterns  
- **Form fields** that materialize based on your previous inputs
- **Product recommendations** that update as you browse
- **Code completion** that streams suggestions as you type

The combination of Cloudflare Workers' edge compute and Vercel AI SDK's structured streaming creates a new paradigm: **contextual interfaces that build themselves**.

Instead of sending the same UI to everyone and personalizing with client-side JavaScript, we can:
1. **Analyze user context** at the edge (location, device, behavior)
2. **Generate personalized UI structures** with AI models
3. **Stream interface components** as they're created
4. **Render progressively** for instant perceived performance

This is particularly powerful for:
- **SaaS dashboards** that configure themselves per user role
- **E-commerce interfaces** that adapt to purchasing behavior
- **Developer tools** that surface relevant features contextually
- **Content platforms** that restructure based on engagement patterns

The edge gives us the speed. AI gives us the intelligence. Streaming gives us the fluidity.

We're not just building faster websites—we're building interfaces that think, adapt, and materialize in real-time, uniquely for each user, at the speed of thought.

The future of web development isn't just about shipping code faster. It's about shipping *different code* to each user, generated and streamed from the edge, creating truly personalized experiences that feel like magic.

---

*Want to see the full implementation? Check out the [vibetoprod repository](https://github.com/erniesg/vibetoprod) or try the live demo at [vibetoprod.dev](https://vibetoprod.dev/?streaming=true).*