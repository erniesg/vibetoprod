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
    this.model = openai('gpt-4o-2024-08-06');
    console.log('🤖 Model configured');
  }

  async streamArchitecture(userInput: UserInput) {
    const prompt = this.buildPrompt(userInput);
    
    console.log('🚀 Starting true streaming with Vercel AI SDK');
    console.log('📝 User input:', userInput);
    console.log('🔍 Generated prompt:', prompt);
    console.log('🔍 Using model: gpt-4o-2024-08-06');
    
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
    
    // Auto-select 3 priorities if none selected
    const selectedConstraints = input.constraints.length > 0 
      ? input.constraints 
      : this.autoSelectConstraints(input.persona, input.appDescription, appType);
    
    // Auto-select scale if none selected
    const selectedScale = input.scale || this.autoSelectScale(input.persona);
    
    return `You are an expert cloud architect. Generate a detailed cloud architecture comparison for the following application.

Application: "${input.appDescription}"
Target Persona: ${input.persona === 'AIE/FDE' ? 'AI Engineer and Forward Deployed Engineer' : input.persona}
Scale: ${selectedScale} ${this.getScaleDescription(selectedScale)}
Region: ${input.region || 'Global'}
Competitor: ${competitor}
Available Priorities: Cost Optimization, Speed to Market, Enterprise Security, Global Performance
Selected Priorities: ${selectedConstraints.join(', ')}
${input.constraints.length === 0 ? '(Auto-selected based on persona and app type)' : '(User-selected)'}

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
   - Generate constraintValueProps for each selected priority: ${selectedConstraints.join(', ')}
   - Use EXACT titles and emojis for each priority:
     * Cost Optimization: emoji "💰", title "Cost Optimization"
     * Speed to Market: emoji "🚀", title "Speed to Market"  
     * Enterprise Security: emoji "🔒", title "Enterprise Security"
     * Global Performance: emoji "🌍", title "Global Performance"
   - Keep descriptions SHORT and punchy (maximum 15 words)
   - ALWAYS compare directly vs ${competitor} (e.g., "vs AWS's 5-service setup")
   - Use arrows for impact: "**Built-in DDoS protection** vs AWS's complex setup → **zero downtime**"
   - Format: "Cloudflare advantage vs ${competitor} disadvantage → business outcome"
   - MANDATORY: Include quantified multipliers with competitor comparison
   - Focus on: ${this.getConstraintFocus(selectedConstraints)}
   - Examples: "**Zero egress fees** vs AWS's punitive charges → **5x cost savings**", "**1 Workers service** vs AWS's 3 EC2 instances → **10x faster** deployment"

4. ARCHITECTURE PATTERNS BY APP TYPE:
${this.getAppTypeGuidance(appType, input.persona)}

Generate realistic, production-ready architectures that clearly show why Cloudflare is superior for this use case.`;
  }

  private autoSelectScale(persona: string): string {
    const scaleMapping = {
      'Vibe Coder': 'Startup',
      'AIE/FDE': 'Growth',
      'CIO/CTO': 'Enterprise'
    };
    return scaleMapping[persona as keyof typeof scaleMapping] || 'Startup';
  }

  private getScaleDescription(scale: string): string {
    const scaleDescriptions = {
      'Startup': '(< 10K users)',
      'Growth': '(10K - 100K users)',
      'Enterprise': '(100K - 1M users)',
      'Global': '(1M+ users)'
    };
    return scaleDescriptions[scale as keyof typeof scaleDescriptions] || '(< 10K users)';
  }

  private autoSelectConstraints(persona: string, appDescription: string, appType: string): string[] {
    const allConstraints = ['Cost Optimization', 'Speed to Market', 'Enterprise Security', 'Global Performance'];
    
    // Persona-based priority preferences
    const personaPreferences = {
      'Vibe Coder': ['Speed to Market', 'Cost Optimization', 'Global Performance'],
      'AIE/FDE': ['Speed to Market', 'Global Performance', 'Cost Optimization'], 
      'CIO/CTO': ['Enterprise Security', 'Cost Optimization', 'Global Performance']
    };
    
    // App type adjustments
    const appTypeAdjustments = {
      'gaming': ['Global Performance', 'Speed to Market', 'Cost Optimization'],
      'social': ['Global Performance', 'Speed to Market', 'Enterprise Security'],
      'ecommerce': ['Global Performance', 'Enterprise Security', 'Cost Optimization'],
      'api': ['Speed to Market', 'Global Performance', 'Enterprise Security'],
      'media': ['Global Performance', 'Cost Optimization', 'Speed to Market'],
      'general': personaPreferences[persona as keyof typeof personaPreferences] || ['Speed to Market', 'Cost Optimization', 'Global Performance']
    };
    
    // Get app-specific preferences or fall back to persona preferences
    const preferences = appTypeAdjustments[appType] || personaPreferences[persona as keyof typeof personaPreferences] || ['Speed to Market', 'Cost Optimization', 'Global Performance'];
    
    // Return top 3 priorities
    return preferences.slice(0, 3);
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
        case 'Speed to Market':
          return 'integrated platform, instant deployments, minimal configuration';
        case 'Global Performance':
          return 'sub-50ms latency, 300+ edge locations, smart routing';
        case 'Enterprise Security':
          return 'built-in DDoS protection, WAF, zero trust, compliance, 99.99% uptime';
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