import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

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

const app = new Hono();

// CORS middleware
app.use('*', async (c, next) => {
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
});

// Handle OPTIONS requests
app.options('*', (c) => c.text('', 200));

// Streaming API endpoint
app.post('/api/generate-architecture', async (c) => {
  const userInput = await c.req.json();
  console.log('🎯 Generate Architecture Request:', userInput);

  const persona = userInput.persona || 'Vibe Coder';
  const personaData = mockArchitectureData[persona] || mockArchitectureData['Vibe Coder'];
  const cloudflareData = personaData.cloudflare;
  const competitorData = personaData.competitor;

  // Create streaming response
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
        // Phase 5: Send advantages
        else if (index < cloudflareData.nodes.length + cloudflareData.edges.length + competitorData.nodes.length + competitorData.edges.length + cloudflareData.advantages.length) {
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
        // Phase 6: Send value props
        else if (index < cloudflareData.nodes.length + cloudflareData.edges.length + competitorData.nodes.length + competitorData.edges.length + cloudflareData.advantages.length + cloudflareData.valueProps.length) {
          const valuePropIndex = index - cloudflareData.nodes.length - cloudflareData.edges.length - competitorData.nodes.length - competitorData.edges.length - cloudflareData.advantages.length;
          sendChunk({
            type: 'value_prop',
            platform: 'cloudflare',
            data: cloudflareData.valueProps[valuePropIndex],
            timestamp: Date.now()
          });
          index++;
          setTimeout(sendNext, 1000);
        } 
        // Phase 7: Complete
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

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'hono-streaming-api'
  });
});

export default app;