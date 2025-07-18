import { streamObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { architectureResponseSchema } from '../../src/schemas/architecture';
import type { z } from 'zod';

export interface UserInput {
  appDescription: string;
  persona: string;
  constraints: string[];
  competitors: string[];
  scale?: string;
  region?: string;
}

export class ModernOpenAIService {
  private model: any;

  constructor(private apiKey: string) {
    console.log('🔑 OpenAI API Key configured:', this.apiKey ? `Yes (${this.apiKey.substring(0, 7)}...)` : 'No');
    // Create OpenAI instance with explicit API key
    const openai = createOpenAI({
      apiKey: this.apiKey
    });
    this.model = openai('gpt-4-turbo');
    console.log('🤖 Model configured');
  }

  async streamArchitecture(userInput: UserInput) {
    const prompt = this.buildPrompt(userInput);
    
    console.log('🚀 Starting true streaming with Vercel AI SDK');
    console.log('📝 User input:', userInput);
    console.log('🔍 Generated prompt:', prompt);
    console.log('🔍 Using model: gpt-4-turbo');
    
    try {
      const result = streamObject({
        model: this.model,
        schema: architectureResponseSchema,
        prompt,
        mode: 'json',
        // Stream partial objects as they're generated
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'stream-architecture'
        }
      });
      
      console.log('✅ streamObject created successfully');
      console.log('🔍 Available methods on result:', Object.getOwnPropertyNames(result));
      console.log('🔍 Available properties on result:', Object.keys(result));
      console.log('🔍 Has partialObjectStream:', 'partialObjectStream' in result);
      return result;
    } catch (error) {
      console.error('❌ Error creating streamObject:', error);
      throw error;
    }
  }

  private buildPrompt(input: UserInput): string {
    const competitor = input.competitors[0] || 'AWS';
    const appType = this.detectAppType(input.appDescription);
    
    return `You are an expert cloud architect. Generate a detailed cloud architecture comparison for the following application.

Application: "${input.appDescription}"
Target Persona: ${input.persona}
Scale: ${input.scale || 'Startup'}
Region: ${input.region || 'Global'}
Competitor: ${competitor}
Key Constraints: ${input.constraints.length > 0 ? input.constraints.join(', ') : 'None specified'}

CRITICAL REQUIREMENTS:

1. CLOUDFLARE ARCHITECTURE:
   - Generate 4-6 Cloudflare services that best fit the application
   - Include: Workers, Pages, D1, R2, KV, Durable Objects, Analytics, etc.
   - Position nodes in a logical flow from left (users) to right (backend)
   - Use Cloudflare orange colors (#f97316, #ea580c, #dc2626)
   - Connect services with meaningful data flow labels
   - Layout: x: 0-800, y: 0-400

2. COMPETITOR ARCHITECTURE (${competitor}):
   - Generate 5-7 equivalent ${competitor} services
   - Include their typical stack: EC2/Lambda, RDS/DynamoDB, S3, CloudFront, etc.
   - Use gray colors (#6b7280, #4b5563)
   - Show the complexity of their multi-service approach
   - Same layout constraints

3. VALUE PROPOSITIONS:
   ${input.constraints.length > 0 ? `
   - Generate constraintValueProps for each constraint: ${input.constraints.join(', ')}
   - Each should have: icon (from allowed list), emoji, compelling title, detailed description
   - Include specific metrics comparing Cloudflare vs ${competitor}
   - Focus on: ${this.getConstraintFocus(input.constraints)}
   ` : `
   - Generate 4 general advantages highlighting Cloudflare's benefits
   - Focus on: performance, cost, developer experience, global reach
   `}

4. ARCHITECTURE PATTERNS BY APP TYPE:
${this.getAppTypeGuidance(appType, input.persona)}

Generate realistic, production-ready architectures that clearly show why Cloudflare is superior for this use case.`;
  }

  private detectAppType(description: string): string {
    const lower = description.toLowerCase();
    if (lower.includes('game') || lower.includes('multiplayer')) return 'gaming';
    if (lower.includes('social') || lower.includes('chat') || lower.includes('messaging')) return 'social';
    if (lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store')) return 'ecommerce';
    if (lower.includes('api') || lower.includes('backend') || lower.includes('service')) return 'api';
    if (lower.includes('stream') || lower.includes('video') || lower.includes('media')) return 'media';
    return 'general';
  }

  private getConstraintFocus(constraints: string[]): string {
    const focuses = constraints.map(c => {
      switch (c) {
        case 'Cost Optimization':
          return 'zero egress fees, pay-per-use pricing, no idle costs';
        case 'Developer Velocity':
          return 'integrated platform, instant deployments, minimal configuration';
        case 'Global Performance':
          return 'sub-50ms latency, 300+ edge locations, smart routing';
        case 'Enterprise Security':
          return 'built-in DDoS protection, WAF, zero trust, compliance';
        case 'Scalability':
          return 'auto-scaling, no capacity planning, handles viral growth';
        default:
          return 'general optimization';
      }
    });
    return focuses.join('; ');
  }

  private getAppTypeGuidance(appType: string, persona: string): string {
    const guidances: Record<string, string> = {
      gaming: `
   - Cloudflare: Workers for game logic, Durable Objects for real-time state, R2 for assets
   - Competitor: EC2 game servers, ElastiCache for state, S3 for assets, complex networking`,
      
      social: `
   - Cloudflare: Workers for API, D1 for user data, R2 for media, WebSockets for real-time
   - Competitor: EC2/ECS clusters, RDS for data, S3 for media, ElastiCache, SQS`,
      
      ecommerce: `
   - Cloudflare: Pages for frontend, Workers for API, D1 for products, R2 for images
   - Competitor: EC2 for frontend, Lambda for API, RDS for database, S3 for static assets`,
      
      api: `
   - Cloudflare: Workers for endpoints, KV for caching, D1 for data, Analytics for monitoring
   - Competitor: API Gateway, Lambda functions, DynamoDB, CloudWatch, X-Ray`,
      
      media: `
   - Cloudflare: Stream for video, R2 for storage, Workers for transcoding, Images for optimization
   - Competitor: CloudFront CDN, S3 storage, MediaConvert, Lambda for processing`,
      
      general: `
   - Cloudflare: Balanced mix of Workers, Pages, D1, R2 based on ${persona} needs
   - Competitor: Traditional three-tier architecture with multiple services`
    };
    
    return guidances[appType] || guidances.general;
  }
}