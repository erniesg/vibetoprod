import { Hono } from 'hono';
import { OpenAIService } from './services/openaiService';
import { ModernOpenAIService } from './services/modernOpenAIService';
import { CacheService } from './services/cacheService';
import type { Env } from './types';

// Mock architecture data with both Cloudflare and competitor structures
const mockArchitectureData = {
  'Vibe Coder': {
    cloudflare: {
      nodes: [
        { id: 'users', type: 'users', name: 'Developers', subtitle: 'Global Access', position: { x: 50, y: 100 }, color: '#f97316' },
        { id: 'pages', type: 'pages', name: 'Cloudflare Pages', subtitle: 'React Frontend', position: { x: 300, y: 100 }, color: '#ea580c' },
        { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Edge API', position: { x: 550, y: 100 }, color: '#dc2626' },
        { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Edge SQL', position: { x: 300, y: 250 }, color: '#b91c1c' },
        { id: 'r2', type: 'r2', name: 'R2 Storage', subtitle: 'Zero Egress', position: { x: 550, y: 250 }, color: '#991b1b' }
      ],
      edges: [
        { id: 'e1', from: 'users', to: 'pages', label: 'Browse', color: '#f97316', style: 'solid' },
        { id: 'e2', from: 'pages', to: 'workers', label: 'API Calls', color: '#f97316', style: 'solid' },
        { id: 'e3', from: 'workers', to: 'd1', label: 'SQL Query', color: '#f97316', style: 'solid' },
        { id: 'e4', from: 'workers', to: 'r2', label: 'File Store', color: '#f97316', style: 'solid' }
      ],
      advantages: [
        'Zero cold starts for instant response times',
        'Git-based deployment with automatic builds',
        'Built-in TypeScript support and debugging tools',
        'Global edge deployment across 300+ cities'
      ],
      valueProps: [
        'Deploy applications in seconds, not minutes',
        'Save $500/month compared to traditional hosting',
        'Eliminate infrastructure management overhead',
        'Automatic SSL certificates and CDN optimization'
      ]
    },
    competitor: {
      nodes: [
        { id: 'users-comp', type: 'users', name: 'Developers', subtitle: 'Regional Access', position: { x: 50, y: 100 }, color: '#6b7280' },
        { id: 'alb', type: 'load-balancer', name: 'Application Load Balancer', subtitle: 'us-east-1', position: { x: 250, y: 100 }, color: '#6b7280' },
        { id: 'ec2', type: 'ec2', name: 'EC2 Instances', subtitle: 'Frontend Servers', position: { x: 450, y: 100 }, color: '#6b7280' },
        { id: 'lambda', type: 'lambda', name: 'Lambda Functions', subtitle: 'API Backend', position: { x: 650, y: 100 }, color: '#6b7280' },
        { id: 'rds', type: 'database', name: 'RDS Database', subtitle: 'Managed SQL', position: { x: 450, y: 250 }, color: '#6b7280' },
        { id: 's3', type: 's3', name: 'S3 Storage', subtitle: 'Object Store', position: { x: 650, y: 250 }, color: '#6b7280' }
      ],
      edges: [
        { id: 'ec1', from: 'users-comp', to: 'alb', label: 'HTTPS', color: '#6b7280', style: 'solid' },
        { id: 'ec2', from: 'alb', to: 'ec2', label: 'Route', color: '#6b7280', style: 'solid' },
        { id: 'ec3', from: 'ec2', to: 'lambda', label: 'API Calls', color: '#6b7280', style: 'solid' },
        { id: 'ec4', from: 'lambda', to: 'rds', label: 'SQL Query', color: '#6b7280', style: 'solid' },
        { id: 'ec5', from: 'lambda', to: 's3', label: 'File Store', color: '#6b7280', style: 'solid' }
      ]
    }
  },
  'FDE': {
    cloudflare: {
      nodes: [
        { id: 'users', type: 'users', name: 'End Users', subtitle: 'Global Audience', position: { x: 50, y: 100 }, color: '#f97316' },
        { id: 'cdn', type: 'cdn', name: 'Global CDN', subtitle: '300+ Cities', position: { x: 200, y: 100 }, color: '#ea580c' },
        { id: 'pages', type: 'pages', name: 'Cloudflare Pages', subtitle: 'React SPA', position: { x: 350, y: 100 }, color: '#dc2626' },
        { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Edge APIs', position: { x: 500, y: 100 }, color: '#b91c1c' },
        { id: 'kv', type: 'kv', name: 'Workers KV', subtitle: 'Edge Cache', position: { x: 350, y: 250 }, color: '#991b1b' },
        { id: 'analytics', type: 'analytics', name: 'Web Analytics', subtitle: 'Real-time Data', position: { x: 500, y: 250 }, color: '#7c2d12' }
      ],
      edges: [
        { id: 'e1', from: 'users', to: 'cdn', label: 'HTTPS Request', color: '#f97316', style: 'solid' },
        { id: 'e2', from: 'cdn', to: 'pages', label: 'Serve App', color: '#f97316', style: 'solid' },
        { id: 'e3', from: 'pages', to: 'workers', label: 'API Calls', color: '#f97316', style: 'solid' },
        { id: 'e4', from: 'workers', to: 'kv', label: 'Cache Read/Write', color: '#f97316', style: 'solid' },
        { id: 'e5', from: 'workers', to: 'analytics', label: 'Event Tracking', color: '#f97316', style: 'solid' }
      ],
      advantages: [
        'Frontend-optimized edge runtime environment',
        'Seamless React hydration at the edge',
        'Built-in state management with Workers KV',
        'Real-time analytics without third-party dependencies'
      ],
      valueProps: [
        'Reduce Time to Interactive by 40%',
        'Eliminate backend complexity and maintenance',
        'Built-in A/B testing and feature flags',
        'Zero vendor lock-in with Web Standards APIs'
      ]
    },
    competitor: {
      nodes: [
        { id: 'users-comp', type: 'users', name: 'End Users', subtitle: 'Regional Access', position: { x: 50, y: 100 }, color: '#6b7280' },
        { id: 'cloudfront', type: 'cloudfront', name: 'CloudFront CDN', subtitle: 'Edge Locations', position: { x: 200, y: 100 }, color: '#6b7280' },
        { id: 's3-static', type: 's3', name: 'S3 Static Hosting', subtitle: 'React Build', position: { x: 350, y: 100 }, color: '#6b7280' },
        { id: 'api-gateway', type: 'api', name: 'API Gateway', subtitle: 'REST APIs', position: { x: 500, y: 100 }, color: '#6b7280' },
        { id: 'lambda-comp', type: 'lambda', name: 'Lambda Functions', subtitle: 'Backend Logic', position: { x: 650, y: 100 }, color: '#6b7280' },
        { id: 'elasticache', type: 'cache', name: 'ElastiCache', subtitle: 'Redis Cache', position: { x: 500, y: 250 }, color: '#6b7280' },
        { id: 'cloudwatch', type: 'analytics', name: 'CloudWatch', subtitle: 'Monitoring', position: { x: 650, y: 250 }, color: '#6b7280' }
      ],
      edges: [
        { id: 'ec1', from: 'users-comp', to: 'cloudfront', label: 'HTTPS', color: '#6b7280', style: 'solid' },
        { id: 'ec2', from: 'cloudfront', to: 's3-static', label: 'Serve App', color: '#6b7280', style: 'solid' },
        { id: 'ec3', from: 's3-static', to: 'api-gateway', label: 'API Calls', color: '#6b7280', style: 'solid' },
        { id: 'ec4', from: 'api-gateway', to: 'lambda-comp', label: 'Invoke', color: '#6b7280', style: 'solid' },
        { id: 'ec5', from: 'lambda-comp', to: 'elasticache', label: 'Cache', color: '#6b7280', style: 'solid' },
        { id: 'ec6', from: 'lambda-comp', to: 'cloudwatch', label: 'Metrics', color: '#6b7280', style: 'solid' }
      ]
    }
  },
  'CIO/CTO': {
    cloudflare: {
      nodes: [
        { id: 'users', type: 'users', name: 'Enterprise Users', subtitle: '10M+ Global MAU', position: { x: 50, y: 100 }, color: '#f97316' },
        { id: 'security', type: 'security', name: 'Security Suite', subtitle: 'WAF + DDoS Protection', position: { x: 250, y: 50 }, color: '#ea580c' },
        { id: 'cdn', type: 'cdn', name: 'Global CDN', subtitle: '300+ Edge Locations', position: { x: 250, y: 150 }, color: '#ea580c' },
        { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Serverless Compute', position: { x: 450, y: 100 }, color: '#dc2626' },
        { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Distributed SQLite', position: { x: 650, y: 50 }, color: '#b91c1c' },
        { id: 'r2', type: 'r2', name: 'R2 Storage', subtitle: 'S3-Compatible Storage', position: { x: 650, y: 150 }, color: '#991b1b' },
        { id: 'analytics', type: 'analytics', name: 'Analytics Suite', subtitle: 'Enterprise Insights', position: { x: 450, y: 250 }, color: '#7c2d12' }
      ],
      edges: [
        { id: 'e1', from: 'users', to: 'security', label: 'Protected Traffic', color: '#f97316', style: 'solid' },
        { id: 'e2', from: 'users', to: 'cdn', label: 'Global Access', color: '#f97316', style: 'solid' },
        { id: 'e3', from: 'security', to: 'workers', label: 'Validated Requests', color: '#f97316', style: 'solid' },
        { id: 'e4', from: 'cdn', to: 'workers', label: 'Edge Processing', color: '#f97316', style: 'solid' },
        { id: 'e5', from: 'workers', to: 'd1', label: 'SQL Operations', color: '#f97316', style: 'solid' },
        { id: 'e6', from: 'workers', to: 'r2', label: 'Object Operations', color: '#f97316', style: 'solid' },
        { id: 'e7', from: 'workers', to: 'analytics', label: 'Business Intelligence', color: '#f97316', style: 'solid' }
      ],
      advantages: [
        'Enterprise-grade security and compliance (SOC 2, ISO 27001)',
        '99.99% uptime SLA with global redundancy',
        'Predictable pricing with zero data egress fees',
        'GDPR and SOC2 compliant infrastructure by default'
      ],
      valueProps: [
        'Reduce total infrastructure costs by 60%',
        'Eliminate vendor lock-in with open standards',
        'Scale to millions of users without provisioning',
        'Built-in disaster recovery and automated backups'
      ]
    },
    competitor: {
      nodes: [
        { id: 'users-comp', type: 'users', name: 'Enterprise Users', subtitle: 'Regional Distribution', position: { x: 50, y: 100 }, color: '#6b7280' },
        { id: 'waf', type: 'security', name: 'AWS WAF', subtitle: 'Security Layer', position: { x: 200, y: 50 }, color: '#6b7280' },
        { id: 'shield', type: 'security', name: 'AWS Shield', subtitle: 'DDoS Protection', position: { x: 200, y: 150 }, color: '#6b7280' },
        { id: 'cloudfront-ent', type: 'cloudfront', name: 'CloudFront', subtitle: 'Enterprise CDN', position: { x: 350, y: 100 }, color: '#6b7280' },
        { id: 'alb-ent', type: 'load-balancer', name: 'Application LB', subtitle: 'Multi-AZ', position: { x: 500, y: 100 }, color: '#6b7280' },
        { id: 'ecs', type: 'ecs', name: 'ECS Fargate', subtitle: 'Container Compute', position: { x: 650, y: 100 }, color: '#6b7280' },
        { id: 'rds-ent', type: 'database', name: 'RDS Multi-AZ', subtitle: 'Managed Database', position: { x: 500, y: 250 }, color: '#6b7280' },
        { id: 's3-ent', type: 's3', name: 'S3 Enterprise', subtitle: 'Object Storage', position: { x: 650, y: 250 }, color: '#6b7280' },
        { id: 'cloudwatch-ent', type: 'analytics', name: 'CloudWatch', subtitle: 'Enterprise Monitoring', position: { x: 800, y: 175 }, color: '#6b7280' }
      ],
      edges: [
        { id: 'ec1', from: 'users-comp', to: 'waf', label: 'Security Check', color: '#6b7280', style: 'solid' },
        { id: 'ec2', from: 'users-comp', to: 'shield', label: 'DDoS Protection', color: '#6b7280', style: 'solid' },
        { id: 'ec3', from: 'waf', to: 'cloudfront-ent', label: 'Clean Traffic', color: '#6b7280', style: 'solid' },
        { id: 'ec4', from: 'shield', to: 'cloudfront-ent', label: 'Protected Traffic', color: '#6b7280', style: 'solid' },
        { id: 'ec5', from: 'cloudfront-ent', to: 'alb-ent', label: 'Route', color: '#6b7280', style: 'solid' },
        { id: 'ec6', from: 'alb-ent', to: 'ecs', label: 'Forward', color: '#6b7280', style: 'solid' },
        { id: 'ec7', from: 'ecs', to: 'rds-ent', label: 'SQL', color: '#6b7280', style: 'solid' },
        { id: 'ec8', from: 'ecs', to: 's3-ent', label: 'Objects', color: '#6b7280', style: 'solid' },
        { id: 'ec9', from: 'ecs', to: 'cloudwatch-ent', label: 'Metrics', color: '#6b7280', style: 'solid' }
      ]
    }
  }
};

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', async (c, next) => {
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
});

// Handle OPTIONS requests
app.options('*', (c) => c.text('', 200));

// Priority icon mapping (consistent with PrioritiesSelector)
const priorityIcons = {
  'Cost Optimization': { icon: 'DollarSign', emoji: '💰' },
  'Global Performance': { icon: 'Globe', emoji: '🌍' },
  'Enterprise Security': { icon: 'Shield', emoji: '🔒' },
  'Speed to Market': { icon: 'Rocket', emoji: '🚀' }
};

// App type detection
const detectAppType = (description: string): string => {
  const desc = description.toLowerCase();
  
  if (desc.includes('game') || desc.includes('multiplayer')) return 'gaming';
  if (desc.includes('social') || desc.includes('chat') || desc.includes('feed')) return 'social';
  if (desc.includes('e-commerce') || desc.includes('shop') || desc.includes('store')) return 'ecommerce';
  if (desc.includes('api') || desc.includes('backend')) return 'api';
  if (desc.includes('real-time') || desc.includes('collaborative')) return 'realtime';
  if (desc.includes('analytics') || desc.includes('dashboard')) return 'analytics';
  
  return 'webapp';
};

// Generate priority-based advantages
const generatePriorityValueProps = (priorities: string[], appDescription: string, competitor: string) => {
  const appType = detectAppType(appDescription);
  
  return priorities.map((priority) => {
    const iconData = priorityIcons[priority as keyof typeof priorityIcons];
    
    switch (priority) {
      case 'Cost Optimization':
        return {
          icon: iconData?.icon || 'CheckCircle',
          emoji: '💰',
          title: 'Dramatic Cost Reduction',
          description: `Cost advantage: Cloudflare's $0 egress fees vs ${competitor}'s $0.09/GB means ${
            appType === 'gaming' ? 'your multiplayer game saves $90,000 per TB of player data' :
            appType === 'social' ? 'your social platform saves thousands on video streaming costs' :
            appType === 'ecommerce' ? 'your e-commerce site eliminates data transfer fees entirely' :
            'your application cuts infrastructure costs by 60-80%'
          }, plus no idle server costs with true pay-per-use pricing.`
        };
        
      case 'Speed to Market':
        return {
          icon: iconData?.icon || 'CheckCircle',
          emoji: '🚀',
          title: 'Zero to Production',
          description: `Deployment speed: Cloudflare's instant edge deployment vs ${competitor}'s complex provisioning means ${
            appType === 'gaming' ? 'you can push game updates and hotfixes instantly to all players worldwide' :
            appType === 'social' ? 'you launch features in minutes, not hours' :
            appType === 'api' ? 'your APIs are live globally in seconds' :
            'you deploy 10x faster with zero infrastructure setup'
          }, shipping features while competitors are still configuring.`
        };
        
      case 'Global Performance':
        return {
          icon: iconData?.icon || 'CheckCircle',
          emoji: '🌍',
          title: 'Sub-50ms Globally',
          description: `Performance advantage: Cloudflare's <50ms global latency vs ${competitor}'s 200ms+ regional delays means ${
            appType === 'gaming' ? 'players in Singapore, São Paulo, and Stockholm all get identical ultra-low latency' :
            appType === 'social' ? 'users see real-time updates instantly, boosting engagement by 40%' :
            appType === 'ecommerce' ? 'customers worldwide experience local-speed shopping, increasing conversions' :
            'users experience consistently fast performance regardless of location'
          }, with 300+ edge locations vs their handful of regions.`
        };
        
      case 'Enterprise Security':
        return {
          icon: iconData?.icon || 'CheckCircle',
          emoji: '🔒',
          title: 'Security by Default',
          description: `Security advantage: Cloudflare's built-in DDoS protection and WAF vs ${competitor}'s additional security services means ${
            appType === 'gaming' ? 'your game servers are protected from attacks without performance impact' :
            appType === 'ecommerce' ? 'customer data and transactions are secured by default with PCI compliance' :
            appType === 'api' ? 'your APIs are protected from abuse and attacks automatically' :
            'your application gets enterprise-grade security'
          }, with zero additional configuration or licensing costs.`
        };
        
      default:
        return {
          icon: 'CheckCircle',
          emoji: '✨',
          title: 'Cloudflare Advantage',
          description: 'Cloudflare delivers superior performance and developer experience compared to traditional cloud providers.'
        };
    }
  });
};

// Real-time streaming function
const createRealTimeStreamingResponse = async (c: any, userInput: any) => {
  console.log('🚀 Creating real-time streaming response');
  
  const useAIGateway = c.env.CLOUDFLARE_ACCOUNT_ID && c.env.AI_GATEWAY_ID;
  const openai = useAIGateway
    ? new OpenAIService(c.env.OPENAI_API_KEY, {
        accountId: c.env.CLOUDFLARE_ACCOUNT_ID,
        gatewayId: c.env.AI_GATEWAY_ID
      })
    : new OpenAIService(c.env.OPENAI_API_KEY);

  // Auto-select priorities and scale if none provided
  const finalPriorities = userInput.priorities?.length > 0 
    ? userInput.priorities 
    : openai.selectPriorities(userInput.persona);
  const finalScale = userInput.scale || openai.selectScale(userInput.persona);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      function sendChunk(chunk: Record<string, unknown>) {
        const line = `data: ${JSON.stringify(chunk)}\n\n`;
        controller.enqueue(encoder.encode(line));
      }

      try {
        // Generate both architectures in parallel
        console.log('🔄 Generating both architectures in parallel...');
        const [cloudflareArch, competitorArch] = await Promise.all([
          openai.generateCloudflareArchitecture({
            appDescription: userInput.appDescription,
            persona: userInput.persona,
            scale: finalScale,
            priorities: finalPriorities,
            region: userInput.region || 'Global'
          }),
          openai.generateCompetitorArchitecture({
            competitor: userInput.competitors?.[0] || 'AWS',
            appDescription: userInput.appDescription,
            persona: userInput.persona,
            scale: finalScale,
            region: userInput.region || 'Global'
          })
        ]);

        // Stream Cloudflare nodes
        if (cloudflareArch.nodes) {
          for (const node of cloudflareArch.nodes) {
            sendChunk({
              type: 'node',
              platform: 'cloudflare',
              data: node,
              timestamp: Date.now()
            });
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }

        // Stream Cloudflare edges
        if (cloudflareArch.edges) {
          for (const edge of cloudflareArch.edges) {
            sendChunk({
              type: 'edge',
              platform: 'cloudflare',
              data: edge,
              timestamp: Date.now()
            });
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        // Stream competitor nodes
        if (competitorArch.nodes) {
          for (const node of competitorArch.nodes) {
            sendChunk({
              type: 'node',
              platform: 'competitor',
              data: node,
              timestamp: Date.now()
            });
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        // Stream competitor edges
        if (competitorArch.edges) {
          for (const edge of competitorArch.edges) {
            sendChunk({
              type: 'edge',
              platform: 'competitor',
              data: edge,
              timestamp: Date.now()
            });
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        // Phase 3: Generate and stream priority advantages
        if (finalPriorities && finalPriorities.length > 0) {
          console.log('🔄 Generating priority advantages...');
          try {
            const priorityValueProps = await openai.generatePriorityAdvantages({
              priorities: finalPriorities,
              appDescription: userInput.appDescription,
              competitor: userInput.competitors?.[0] || 'AWS',
              cloudflareArch,
              competitorArch
            });

            console.log('🎯 Raw priority value props response:', priorityValueProps);
            console.log('🎯 Is array?', Array.isArray(priorityValueProps));
            console.log('🎯 Length:', priorityValueProps?.length);

            // Handle both array and single object responses
            let valuePropsArray;
            if (Array.isArray(priorityValueProps)) {
              valuePropsArray = priorityValueProps;
            } else if (priorityValueProps && typeof priorityValueProps === 'object') {
              console.log('🔧 Converting single object to array');
              valuePropsArray = [priorityValueProps];
            } else {
              valuePropsArray = [];
            }

            if (valuePropsArray.length > 0) {
              console.log('🚀 Starting to stream', valuePropsArray.length, 'priority value props');
              for (const valueProp of valuePropsArray) {
                console.log('📤 Sending priority_value_prop chunk:', valueProp);
                sendChunk({
                  type: 'priority_value_prop',
                  platform: 'cloudflare',
                  data: valueProp,
                  timestamp: Date.now()
                });
                await new Promise(resolve => setTimeout(resolve, 800));
              }
              console.log('✅ Finished streaming priority value props');
            } else {
              console.log('❌ No valid priority value props to stream');
            }
          } catch (error) {
            console.error('❌ Failed to generate priority advantages:', error);
          }
        }

        // Phase 4: Stream generic advantages if no priorities
        if (cloudflareArch.advantages && (!finalPriorities || finalPriorities.length === 0)) {
          for (const advantage of cloudflareArch.advantages) {
            sendChunk({
              type: 'advantage',
              platform: 'cloudflare',
              data: advantage,
              timestamp: Date.now()
            });
            await new Promise(resolve => setTimeout(resolve, 600));
          }
        }

        // Phase 5: Stream value props
        if (cloudflareArch.valueProps && (!finalPriorities || finalPriorities.length === 0)) {
          for (const valueProp of cloudflareArch.valueProps) {
            sendChunk({
              type: 'value_prop',
              platform: 'cloudflare',
              data: valueProp,
              timestamp: Date.now()
            });
            await new Promise(resolve => setTimeout(resolve, 600));
          }
        }

        // Complete
        sendChunk({
          type: 'complete',
          platform: 'cloudflare',
          data: 'Architecture generation complete',
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('❌ Streaming error:', error);
        sendChunk({
          type: 'error',
          data: error.message,
          timestamp: Date.now()
        });
      } finally {
        controller.close();
      }
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
};

// Streaming API endpoint
app.post('/api/generate-architecture', async (c) => {
  const userInput = await c.req.json();
  console.log('🎯 Generate Architecture Request:', {
    ...userInput,
    hasPriorities: userInput.priorities?.length > 0,
    prioritiesCount: userInput.priorities?.length || 0
  });
  
  // Check if this is a streaming request
  const isStreamingRequest = userInput.streaming === true;

  // Initialize services
  const cache = isStreamingRequest ? null : new CacheService(c.env.KV);
  const useOpenAI = !!c.env.OPENAI_API_KEY;
  
  let cloudflareData;
  let competitorData;
  let priorityValueProps = [];

  // Check cache first (skip for streaming requests)
  if (useOpenAI && !isStreamingRequest && cache) {
    const cached = await cache.get<{
      cloudflare: any;
      competitor: any;
      priorityValueProps: any[];
    }>(userInput);
    
    if (cached) {
      console.log('🎯 Using cached architecture');
      cloudflareData = cached.cloudflare;
      competitorData = cached.competitor;
      priorityValueProps = cached.priorityValueProps || [];
    }
  }

  // Handle streaming requests differently
  if (isStreamingRequest && useOpenAI) {
    // For streaming, we'll generate and stream in real-time
    return createRealTimeStreamingResponse(c, userInput);
  }

  // Generate with OpenAI if not cached (non-streaming)
  if (useOpenAI && !cloudflareData) {
    try {
      console.log('🤖 Using OpenAI for architecture generation (non-streaming)');
      const openai = new OpenAIService(c.env.OPENAI_API_KEY);
      
      // Auto-select priorities if none provided
      const finalPriorities = userInput.priorities?.length > 0 
        ? userInput.priorities 
        : openai.selectPriorities(userInput.persona);
      
      // Auto-select scale if none provided
      const finalScale = userInput.scale || openai.selectScale(userInput.persona);

      // Generate both architectures in parallel
      const [cloudflareArch, competitorArch] = await Promise.all([
        openai.generateCloudflareArchitecture({
          appDescription: userInput.appDescription,
          persona: userInput.persona,
          scale: finalScale,
          priorities: finalPriorities,
          region: userInput.region || 'Global'
        }),
        openai.generateCompetitorArchitecture({
          competitor: userInput.competitors?.[0] || 'AWS',
          appDescription: userInput.appDescription,
          persona: userInput.persona,
          scale: finalScale,
          region: userInput.region || 'Global'
        })
      ]);

      // Ensure cloudflareData has all required fields
      cloudflareData = {
        nodes: cloudflareArch.nodes || [],
        edges: cloudflareArch.edges || [],
        advantages: cloudflareArch.advantages || [],
        valueProps: cloudflareArch.valueProps || []
      };
      competitorData = competitorArch;

      // Generate priority-based advantages
      try {
        priorityValueProps = await openai.generatePriorityAdvantages({
          priorities: finalPriorities,
          appDescription: userInput.appDescription,
          competitor: userInput.competitors?.[0] || 'AWS',
          cloudflareArch,
          competitorArch
        });
        console.log('🎯 Generated priority value props:', priorityValueProps?.length || 0);
      } catch (error) {
        console.error('❌ Failed to generate priority advantages:', error);
        priorityValueProps = [];
      }

      // Cache the successful result
      if (cache) {
        await cache.set(userInput, {
          cloudflare: cloudflareData,
          competitor: competitorData,
          priorityValueProps
        });
      }
    } catch (error) {
      console.error('❌ OpenAI generation failed, falling back to mock data:', error);
      // Fall back to mock data
      const persona = userInput.persona || 'Vibe Coder';
      const personaData = mockArchitectureData[persona] || mockArchitectureData['Vibe Coder'];
      cloudflareData = personaData.cloudflare;
      competitorData = personaData.competitor;
      
      if (userInput.priorities && userInput.priorities.length > 0) {
        priorityValueProps = generatePriorityValueProps(userInput.priorities, userInput.appDescription || '', userInput.competitors?.[0] || 'AWS');
      }
    }
  } else {
    // Use mock data
    const persona = userInput.persona || 'Vibe Coder';
    const personaData = mockArchitectureData[persona] || mockArchitectureData['Vibe Coder'];
    cloudflareData = personaData.cloudflare;
    competitorData = personaData.competitor;
    
    if (userInput.priorities && userInput.priorities.length > 0) {
      priorityValueProps = generatePriorityValueProps(userInput.priorities, userInput.appDescription || '', userInput.competitors?.[0] || 'AWS');
    }
  }

  // Create streaming response
  console.log('📡 Creating streaming response', {
    hasCloudflareData: !!cloudflareData,
    hasCompetitorData: !!competitorData,
    priorityValuePropsCount: priorityValueProps.length
  });
  
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let index = 0;

      function sendChunk(chunk: Record<string, unknown>) {
        const line = `data: ${JSON.stringify(chunk)}\n\n`;
        controller.enqueue(encoder.encode(line));
      }

      function sendNext() {
        // Phase 1: Send Cloudflare nodes
        if (index < cloudflareData.nodes.length) {
          sendChunk({
            type: 'node',
            platform: 'cloudflare',
            data: cloudflareData.nodes[index],
            timestamp: Date.now()
          });
          index++;
          setTimeout(sendNext, 800);
        } 
        // Phase 2: Send Cloudflare edges
        else if (index < cloudflareData.nodes.length + cloudflareData.edges.length) {
          const edgeIndex = index - cloudflareData.nodes.length;
          sendChunk({
            type: 'edge',
            platform: 'cloudflare',
            data: cloudflareData.edges[edgeIndex],
            timestamp: Date.now()
          });
          index++;
          setTimeout(sendNext, 600);
        } 
        // Phase 3: Send competitor nodes (for comparison)
        else if (index < cloudflareData.nodes.length + cloudflareData.edges.length + competitorData.nodes.length) {
          const nodeIndex = index - cloudflareData.nodes.length - cloudflareData.edges.length;
          sendChunk({
            type: 'node',
            platform: 'competitor',
            data: competitorData.nodes[nodeIndex],
            timestamp: Date.now()
          });
          index++;
          setTimeout(sendNext, 400);
        }
        // Phase 4: Send competitor edges
        else if (index < cloudflareData.nodes.length + cloudflareData.edges.length + competitorData.nodes.length + competitorData.edges.length) {
          const edgeIndex = index - cloudflareData.nodes.length - cloudflareData.edges.length - competitorData.nodes.length;
          sendChunk({
            type: 'edge',
            platform: 'competitor',
            data: competitorData.edges[edgeIndex],
            timestamp: Date.now()
          });
          index++;
          setTimeout(sendNext, 400);
        }
        // Phase 5: Send priority-based value props (if any)
        else if (priorityValueProps.length > 0 && index < cloudflareData.nodes.length + cloudflareData.edges.length + competitorData.nodes.length + competitorData.edges.length + priorityValueProps.length) {
          const valuePropIndex = index - cloudflareData.nodes.length - cloudflareData.edges.length - competitorData.nodes.length - competitorData.edges.length;
          sendChunk({
            type: 'priority_value_prop',
            platform: 'cloudflare',
            data: priorityValueProps[valuePropIndex],
            timestamp: Date.now()
          });
          index++;
          setTimeout(sendNext, 1200);
        }
        // Phase 6: Send generic advantages (fallback if no priorities)
        else if (priorityValueProps.length === 0 && cloudflareData.advantages && index < cloudflareData.nodes.length + cloudflareData.edges.length + competitorData.nodes.length + competitorData.edges.length + cloudflareData.advantages.length) {
          const advantageIndex = index - cloudflareData.nodes.length - cloudflareData.edges.length - competitorData.nodes.length - competitorData.edges.length;
          sendChunk({
            type: 'advantage',
            platform: 'cloudflare',
            data: cloudflareData.advantages[advantageIndex],
            timestamp: Date.now()
          });
          index++;
          setTimeout(sendNext, 1000);
        } 
        // Phase 7: Send value props (if no priorities)
        else if (priorityValueProps.length === 0 && cloudflareData.valueProps && index < cloudflareData.nodes.length + cloudflareData.edges.length + competitorData.nodes.length + competitorData.edges.length + (cloudflareData.advantages?.length || 0) + cloudflareData.valueProps.length) {
          const valuePropIndex = index - cloudflareData.nodes.length - cloudflareData.edges.length - competitorData.nodes.length - competitorData.edges.length - (cloudflareData.advantages?.length || 0);
          sendChunk({
            type: 'value_prop',
            platform: 'cloudflare',
            data: cloudflareData.valueProps[valuePropIndex],
            timestamp: Date.now()
          });
          index++;
          setTimeout(sendNext, 1000);
        }
        // Phase 8: Complete
        else {
          sendChunk({
            type: 'complete',
            platform: 'cloudflare',
            data: 'Architecture generation complete',
            timestamp: Date.now()
          });
          controller.close();
        }
      }

      // Start streaming after brief delay
      setTimeout(sendNext, 500);
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

// NEW: True streaming with Vercel AI SDK
app.post('/api/generate-architecture-v2', async (c) => {
  try {
    const requestBody = await c.req.json();
    console.log('🚀 V2 Generate Architecture Request:', requestBody);
    
    // Handle both direct input and wrapped input from experimental_useObject
    const userInput = requestBody.input || requestBody;
    console.log('🎯 Processed user input:', userInput);
    
    if (!c.env.OPENAI_API_KEY) {
      return c.json({ error: 'OpenAI API key not configured' }, 400);
    }

    // Phase 2: Rate Limiting with KV
    const rateLimitKey = 'global_generation_count';
    let currentCount = 0;
    
    // Check if KV is available
    if (c.env.KV) {
      try {
        console.log('🔍 Checking rate limit...');
        const countValue = await c.env.KV.get(rateLimitKey);
        currentCount = countValue ? parseInt(countValue) : 0;
        console.log(`📊 Current generation count: ${currentCount}/100`);
        
        if (currentCount >= 100) {
          console.log('🚫 Rate limit exceeded');
          return c.json({ 
            error: 'Generation limit reached (100/100)', 
            count: currentCount,
            message: 'Daily generation limit exceeded. Contact admin to reset or try again tomorrow.',
            canReset: true,
            resetEndpoint: '/admin/reset'
          }, 429);
        }
      } catch (error) {
        console.error('⚠️ Rate limit check failed:', error);
        // Continue without rate limiting if KV fails - don't block the user
      }
    } else {
      console.log('⚠️ KV not available, skipping rate limit check');
    }

    console.log('🔍 Environment debug:');
    console.log('🔑 OpenAI API key exists:', !!c.env.OPENAI_API_KEY);
    console.log('🔑 OpenAI API key length:', c.env.OPENAI_API_KEY?.length);
    console.log('🔑 OpenAI API key starts with sk-:', c.env.OPENAI_API_KEY?.startsWith('sk-'));
    console.log('🏷️ Environment:', c.env.ENVIRONMENT);
    console.log('🌎 Account ID:', c.env.CLOUDFLARE_ACCOUNT_ID);
    console.log('🚪 AI Gateway ID:', c.env.AI_GATEWAY_ID);
    console.log('📦 All env keys:', Object.keys(c.env));

    // Auto-select priorities if none provided
    const openaiService = new OpenAIService(c.env.OPENAI_API_KEY);
    const finalPriorities = userInput.priorities?.length > 0 
      ? userInput.priorities 
      : openaiService.selectPriorities(userInput.persona);
      
    // Auto-select scale if none provided  
    const finalScale = userInput.scale || openaiService.selectScale(userInput.persona);
      
    console.log('🎯 Final priorities for V2:', finalPriorities);
    console.log('🎯 Final scale for V2:', finalScale);

    // Update userInput to include auto-selected priorities and scale
    const updatedUserInput = {
      ...userInput,
      priorities: finalPriorities,
      scale: finalScale
    };

    console.log('🚀 Creating ModernOpenAIService with API key...');
    const modernOpenAI = new ModernOpenAIService(c.env.OPENAI_API_KEY);
    const result = await modernOpenAI.streamArchitecture(updatedUserInput);
    
    // Stream the partial objects using Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          console.log('🔄 Starting to consume partialObjectStream...');
          let chunkCount = 0;
          
          // Check if partialObjectStream exists
          if ('partialObjectStream' in result) {
            console.log('✅ partialObjectStream found! Using it...');
            let finalResponse = null;
            // Use partialObjectStream as documented
            for await (const partialObject of result.partialObjectStream) {
              chunkCount++;
              finalResponse = partialObject; // Keep track of the latest/final response
              const chunk = `data: ${JSON.stringify(partialObject)}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }
            
            // Enhanced logging for final completed architectures and priority advantages
            console.log('🎯 Final LLM Response:', JSON.stringify(finalResponse, null, 2));
            
            if (finalResponse) {
              // Log detailed architecture analysis
              const { cloudflare, competitor, priorityValueProps } = finalResponse;
              
              console.log('\n🏗️ === FINAL ARCHITECTURE ANALYSIS ===');
              
              // Cloudflare Architecture Details
              if (cloudflare?.nodes) {
                console.log(`🟦 Cloudflare Architecture: ${cloudflare.nodes.length} nodes, ${cloudflare.edges?.length || 0} edges`);
                cloudflare.nodes.forEach((node, i) => {
                  console.log(`  Node ${i+1}: ${node.name} (${node.type}) - ${node.description || 'No description'}`);
                });
                if (cloudflare.edges?.length) {
                  console.log(`  Connections: ${cloudflare.edges.map(e => `${e.from}→${e.to}`).join(', ')}`);
                }
              }
              
              // Competitor Architecture Details  
              if (competitor?.nodes) {
                console.log(`🟩 Competitor Architecture: ${competitor.nodes.length} nodes, ${competitor.edges?.length || 0} edges`);
                competitor.nodes.forEach((node, i) => {
                  console.log(`  Node ${i+1}: ${node.name} (${node.type}) - ${node.description || 'No description'}`);
                });
                if (competitor.edges?.length) {
                  console.log(`  Connections: ${competitor.edges.map(e => `${e.from}→${e.to}`).join(', ')}`);
                }
              }
              
              // Priority-Based Value Propositions
              if (priorityValueProps?.length) {
                console.log(`🎯 Priority Advantages: ${priorityValueProps.length} value propositions generated`);
                priorityValueProps.forEach((prop, i) => {
                  console.log(`  ${i+1}. ${prop.emoji} ${prop.title}`);
                  console.log(`     ${prop.description?.substring(0, 100)}...`);
                });
              }
              
              // Architecture comparison summary
              const cloudflareNodeCount = cloudflare?.nodes?.length || 0;
              const competitorNodeCount = competitor?.nodes?.length || 0;
              const complexity = cloudflareNodeCount < competitorNodeCount ? 'Simpler' : cloudflareNodeCount > competitorNodeCount ? 'More Complex' : 'Similar Complexity';
              
              console.log(`📊 Architecture Comparison: Cloudflare (${cloudflareNodeCount} nodes) vs Competitor (${competitorNodeCount} nodes) - ${complexity}`);
              console.log('🏁 === END ARCHITECTURE ANALYSIS ===\n');
            }
          } else {
            console.log('❌ partialObjectStream not found, using baseStream...');
            // Fallback to baseStream
            const reader = result.baseStream.getReader();
          
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              chunkCount++;
              
              // Handle different value types
              if (typeof value === 'string') {
                // Already a string
                controller.enqueue(encoder.encode(value));
              } else if (value instanceof Uint8Array) {
                // Bytes array - decode first
                const text = new TextDecoder().decode(value);
                controller.enqueue(encoder.encode(text));
              } else {
                // Object or other type - stringify
                const text = JSON.stringify(value);
                controller.enqueue(encoder.encode(text));
              }
            }
          }
          
          console.log(`✅ Stream complete. Total chunks: ${chunkCount}`);
          
          // Phase 2: Increment rate limit counter after successful generation
          if (c.env.KV && chunkCount > 0) {
            try {
              const newCount = currentCount + 1;
              await c.env.KV.put(rateLimitKey, newCount.toString());
              console.log(`✅ Generation count updated: ${newCount}/100`);
            } catch (error) {
              console.error('⚠️ Failed to update rate limit counter:', error);
              // Don't fail the request if counter update fails
            }
          }
          
          // Send completion marker
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        } catch (error) {
          console.error('❌ Streaming error:', error);
          const errorChunk = `data: ${JSON.stringify({ error: error.message })}\n\n`;
          controller.enqueue(encoder.encode(errorChunk));
        } finally {
          controller.close();
        }
      }
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('❌ V2 API Error:', error);
    return c.json({ 
      error: 'Failed to generate architecture',
      details: error.message 
    }, 500);
  }
});

// Admin authentication helper
async function verifyAdminAuth(c: any): Promise<boolean> {
  const authHeader = c.req.header('Authorization') || c.req.header('X-Admin-Key');
  
  if (!authHeader || !c.env.ADMIN_API_KEY) {
    return false;
  }
  
  // Support both formats: "Bearer <key>" and direct key
  const providedKey = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
  
  return c.env.ADMIN_API_KEY === providedKey;
}

// Phase 3: Admin Reset Endpoints
app.post('/admin/reset', async (c) => {
  try {
    const isAuthorized = await verifyAdminAuth(c);
    
    if (!isAuthorized) {
      console.log('🚫 Unauthorized admin reset attempt');
      return c.json({ 
        error: 'Unauthorized',
        message: 'Valid admin key required in Authorization header or X-Admin-Key' 
      }, 401);
    }
    
    if (!c.env.KV) {
      return c.json({ 
        error: 'KV not available',
        message: 'Key-Value store is not configured' 
      }, 500);
    }
    
    await c.env.KV.put('global_generation_count', '0');
    console.log('✅ Admin reset: Generation counter reset to 0');
    
    return c.json({ 
      success: true, 
      message: 'Generation counter reset to 0',
      resetAt: new Date().toISOString(),
      newCount: 0
    });
  } catch (error) {
    console.error('❌ Admin reset failed:', error);
    return c.json({ 
      error: 'Reset failed',
      details: error.message 
    }, 500);
  }
});

// Admin status endpoint for monitoring
app.get('/admin/status', async (c) => {
  try {
    const isAuthorized = await verifyAdminAuth(c);
    
    if (!isAuthorized) {
      return c.json({ 
        error: 'Unauthorized',
        message: 'Valid admin key required in Authorization header or X-Admin-Key' 
      }, 401);
    }
    
    if (!c.env.KV) {
      return c.json({ 
        error: 'KV not available',
        currentCount: 'unknown',
        limit: 100,
        remaining: 'unknown',
        status: 'KV_UNAVAILABLE'
      });
    }
    
    const countValue = await c.env.KV.get('global_generation_count');
    const currentCount = countValue ? parseInt(countValue) : 0;
    
    return c.json({
      currentCount,
      limit: 100,
      remaining: Math.max(0, 100 - currentCount),
      status: currentCount >= 100 ? 'LIMITED' : 'ACTIVE',
      lastChecked: new Date().toISOString(),
      kvAvailable: true
    });
  } catch (error) {
    console.error('❌ Admin status check failed:', error);
    return c.json({ 
      error: 'Status check failed',
      details: error.message 
    }, 500);
  }
});

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'hono-streaming-api'
  });
});

// Fallback to index.html for client-side routing (static assets handled by wrangler.toml)
app.get('*', (c) => {
  return c.html(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vibe to Prod: The Edge Advantage</title>
    <script type="module" crossorigin src="/assets/index-OtR4dV0c.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-kEwzlIDN.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`);
});

export default app;