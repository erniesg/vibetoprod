import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { cors } from 'hono/cors';
import OpenAI from 'openai';

interface Env {
  OPENAI_API_KEY: string;
}

interface UserInput {
  persona: 'Vibe Coder' | 'FDE' | 'CIO/CTO';
  region: string;
  appDescription: string;
  competitors: ('AWS' | 'GCP' | 'Azure' | 'Vercel')[];
  scale: 'Startup' | 'Growth' | 'Enterprise' | 'Global';
  constraints: string[];
}

interface StreamingChunk {
  type: 'node' | 'edge' | 'advantage' | 'value_prop' | 'complete';
  platform: 'cloudflare' | 'competitor';
  data: any;
  timestamp: number;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// Language detection based on region
function getLanguage(region: string): string {
  const regionMap: Record<string, string> = {
    'Tokyo': 'Japanese',
    'Hong Kong': 'Traditional Chinese',
    'Seoul': 'Korean',
    'Singapore': 'English',
    'Sydney': 'English',
    'Mumbai': 'English'
  };
  return regionMap[region] || 'English';
}

// Generate architecture prompt based on input
function generateArchitecturePrompt(input: UserInput): string {
  const language = getLanguage(input.region);
  const { persona, appDescription, scale, constraints, competitors } = input;
  
  return `You are an expert cloud architect. Generate a Cloudflare architecture for the following application and stream the response as JSON chunks.

Application: ${appDescription}
Persona: ${persona}
Scale: ${scale}
Constraints: ${constraints.join(', ')}
Region: ${input.region}
Language: ${language}
Competitor: ${competitors[0] || 'AWS'}

Stream your response as individual JSON objects, one per line, in this exact format:

For nodes:
{"type": "node", "platform": "cloudflare", "data": {"id": "users", "type": "users", "name": "Users", "subtitle": "Global Access", "position": {"x": 50, "y": 115}, "color": "#f97316"}, "timestamp": ${Date.now()}}

For edges:
{"type": "edge", "platform": "cloudflare", "data": {"id": "e1", "from": "users", "to": "cdn", "label": "HTTPS", "color": "#f97316", "style": "solid"}, "timestamp": ${Date.now()}}

For advantages:
{"type": "advantage", "platform": "cloudflare", "data": "Zero cold starts for instant response", "timestamp": ${Date.now()}}

For value propositions:
{"type": "value_prop", "platform": "cloudflare", "data": "Save $2,340/month on infrastructure costs", "timestamp": ${Date.now()}}

When complete:
{"type": "complete", "platform": "cloudflare", "data": "Architecture generation complete", "timestamp": ${Date.now()}}

Available node types: users, mobile, web, pages, workers, d1, kv, r2, durable-objects, analytics, stream, images, webhooks, clients, cdn

Constraints interpretation:
- Performance-Critical: Focus on edge placement, zero cold starts, low latency
- Cost-Conscious: Highlight R2 zero egress, predictable pricing  
- Security-First: Emphasize WAF, DDoS protection, compliance
- Developer-Focused: Show TypeScript support, git-based deployment

Persona considerations:
- Vibe Coder: Simple, elegant architecture, emphasize speed to production
- FDE: Full-stack capabilities, React/TypeScript integration
- CIO/CTO: Enterprise features, cost optimization, compliance

Generate responses in ${language} where appropriate for descriptions.

Start streaming the architecture now:`;
}

app.post('/generate-architecture', async (c) => {
  try {
    const userInput: UserInput = await c.req.json();
    
    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });

    const prompt = generateArchitecturePrompt(userInput);

    const chatStream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.7,
    });

    return stream(c, async (stream) => {
      try {
        let buffer = '';
        
        for await (const chunk of chatStream) {
          const content = chunk.choices[0]?.delta?.content || '';
          buffer += content;
          
          // Look for complete JSON lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line
          
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
              try {
                // Validate JSON
                JSON.parse(trimmed);
                await stream.write(`data: ${trimmed}\n\n`);
              } catch (e) {
                // Skip invalid JSON
                console.warn('Invalid JSON chunk:', trimmed);
              }
            }
          }
        }
        
        // Ensure completion marker
        const completionChunk = {
          type: 'complete',
          platform: 'cloudflare',
          data: 'Architecture generation complete',
          timestamp: Date.now()
        };
        await stream.write(`data: ${JSON.stringify(completionChunk)}\n\n`);
        
      } catch (error) {
        console.error('Streaming error:', error);
        const errorChunk = {
          type: 'error',
          platform: 'cloudflare',
          data: 'Error generating architecture',
          timestamp: Date.now()
        };
        await stream.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return c.json({ error: 'Failed to generate architecture' }, 500);
  }
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;