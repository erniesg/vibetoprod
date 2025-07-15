import { UserInput, ArchitectureResponse, DiagramData } from '../types';

// Real-world examples for each persona and scale
const getPersonaExample = (persona: UserInput['persona'], scale: UserInput['scale']) => {
  const examples = {
    'Vibe Coder': {
      'Startup': 'A personal blog with comments and newsletter signup',
      'Growth': 'A SaaS tool for team collaboration with real-time features',
      'Enterprise': 'A multi-tenant platform serving 100K+ users globally',
      'Global': 'An open-source project with millions of downloads worldwide'
    },
    'FDE': {
      'Startup': 'A React app with TypeScript, authentication, and file uploads',
      'Growth': 'A Next.js e-commerce site with payment processing and inventory',
      'Enterprise': 'A complex dashboard with real-time data and advanced analytics',
      'Global': 'A social platform with video streaming and global user base'
    },
    'CIO/CTO': {
      'Startup': 'MVP with basic CRUD operations and user management',
      'Growth': 'Production app requiring 99.9% uptime and compliance',
      'Enterprise': 'Mission-critical system with enterprise security requirements',
      'Global': 'Platform serving millions with strict SLA and regulatory compliance'
    }
  };
  
  return examples[persona][scale];
};

// System design patterns based on app type and scale
const getSystemDesign = (input: UserInput) => {
  const { appDescription, scale, persona } = input;
  const appType = detectAppType(appDescription);
  
  return generateArchitectureForApp(appType, scale, persona, input);
};

const detectAppType = (description: string): string => {
  const desc = description.toLowerCase();
  
  if (desc.includes('e-commerce') || desc.includes('shop') || desc.includes('store')) return 'ecommerce';
  if (desc.includes('social') || desc.includes('feed') || desc.includes('post')) return 'social';
  if (desc.includes('api') || desc.includes('backend') || desc.includes('microservice')) return 'api';
  if (desc.includes('blog') || desc.includes('cms') || desc.includes('content')) return 'cms';
  if (desc.includes('real-time') || desc.includes('chat') || desc.includes('messaging')) return 'realtime';
  if (desc.includes('analytics') || desc.includes('dashboard') || desc.includes('data')) return 'analytics';
  if (desc.includes('game') || desc.includes('gaming')) return 'gaming';
  if (desc.includes('iot') || desc.includes('sensor') || desc.includes('device')) return 'iot';
  
  return 'webapp';
};

const generateArchitectureForApp = (appType: string, scale: UserInput['scale'], persona: UserInput['persona'], input: UserInput) => {
  const architectures = {
    ecommerce: generateEcommerceArchitecture(scale, input),
    social: generateSocialArchitecture(scale, input),
    api: generateAPIArchitecture(scale, input),
    cms: generateCMSArchitecture(scale, input),
    realtime: generateRealtimeArchitecture(scale, input),
    analytics: generateAnalyticsArchitecture(scale, input),
    gaming: generateGamingArchitecture(scale, input),
    iot: generateIoTArchitecture(scale, input),
    webapp: generateWebAppArchitecture(scale, input),
  };
  
  return architectures[appType as keyof typeof architectures] || architectures.webapp;
};

const generateEcommerceArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  const competitor = input.competitors[0];
  
  const cloudflareShapes = [
    { id: 'users', type: 'users', name: 'Customers', subtitle: 'Global Shoppers', position: { x: 50, y: 50 }, color: '#f97316' },
    { id: 'cdn', type: 'cdn', name: 'Cloudflare CDN', subtitle: '300+ Edge Locations', position: { x: 250, y: 50 }, color: '#f97316' },
    { id: 'pages', type: 'pages', name: 'Pages', subtitle: 'React Storefront', position: { x: 450, y: 50 }, color: '#ea580c' },
    { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Cart & Checkout API', position: { x: 250, y: 180 }, color: '#dc2626' },
    { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Products & Orders', position: { x: 50, y: 310 }, color: '#b91c1c' },
    { id: 'r2', type: 'r2', name: 'R2 Storage', subtitle: 'Product Images', position: { x: 250, y: 310 }, color: '#991b1b' },
    { id: 'kv', type: 'kv', name: 'Workers KV', subtitle: 'User Sessions', position: { x: 450, y: 180 }, color: '#7c2d12' },
  ];

  if (scale === 'Enterprise' || scale === 'Global') {
    cloudflareShapes.push(
      { id: 'durable', type: 'durable-objects', name: 'Durable Objects', subtitle: 'Real-time Cart', position: { x: 450, y: 310 }, color: '#92400e' },
      { id: 'analytics', type: 'analytics', name: 'Web Analytics', subtitle: 'Customer Insights', position: { x: 650, y: 180 }, color: '#a16207' }
    );
  }

  const competitorShapes = getCompetitorArchitecture(competitor, 'ecommerce', scale);

  const cloudflareArrows = [
    { id: 'e1', from: 'users', to: 'cdn', label: 'Browse Store', color: '#f97316', style: 'solid' as const },
    { id: 'e2', from: 'cdn', to: 'pages', label: 'Serve Frontend', color: '#f97316', style: 'solid' as const },
    { id: 'e3', from: 'pages', to: 'workers', label: 'Add to Cart', color: '#f97316', style: 'solid' as const },
    { id: 'e4', from: 'workers', to: 'd1', label: 'Query Products', color: '#f97316', style: 'solid' as const },
    { id: 'e5', from: 'workers', to: 'r2', label: 'Load Images', color: '#f97316', style: 'solid' as const },
    { id: 'e6', from: 'workers', to: 'kv', label: 'Store Session', color: '#f97316', style: 'solid' as const },
  ];

  if (scale === 'Enterprise' || scale === 'Global') {
    cloudflareArrows.push(
      { id: 'e7', from: 'workers', to: 'durable', label: 'Real-time Cart', color: '#f97316', style: 'solid' as const },
      { id: 'e8', from: 'workers', to: 'analytics', label: 'Track Events', color: '#f97316', style: 'solid' as const }
    );
  }

  const competitorArrows = getCompetitorArrows(competitor, 'ecommerce');

  return {
    cloudflare: {
      shapes: cloudflareShapes,
      arrows: cloudflareArrows,
      labels: [
        { id: 'l1', text: 'Zero Cold Starts', position: { x: 50, y: 400 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Global Edge Network', position: { x: 250, y: 400 }, size: 'medium' as const, color: '#ea580c' },
        { id: 'l3', text: 'No Data Egress Fees', position: { x: 450, y: 400 }, size: 'medium' as const, color: '#dc2626' },
      ]
    },
    competitor: {
      shapes: competitorShapes,
      arrows: competitorArrows,
      labels: [
        { id: 'l1', text: 'Cold Start Delays', position: { x: 50, y: 400 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Regional Limitations', position: { x: 250, y: 400 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l3', text: 'High Egress Costs', position: { x: 450, y: 400 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const generateSocialArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  const cloudflareShapes = [
    { id: 'mobile', type: 'mobile', name: 'Mobile Users', subtitle: 'iOS/Android App', position: { x: 50, y: 50 }, color: '#f97316' },
    { id: 'web', type: 'web', name: 'Web Users', subtitle: 'React PWA', position: { x: 50, y: 180 }, color: '#f97316' },
    { id: 'cdn', type: 'cdn', name: 'Edge Network', subtitle: 'Global CDN', position: { x: 250, y: 115 }, color: '#ea580c' },
    { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Social Feed API', position: { x: 450, y: 115 }, color: '#dc2626' },
    { id: 'durable', type: 'durable-objects', name: 'Durable Objects', subtitle: 'Live Chat Rooms', position: { x: 650, y: 50 }, color: '#b91c1c' },
    { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Posts & Users', position: { x: 450, y: 250 }, color: '#991b1b' },
    { id: 'r2', type: 'r2', name: 'R2 Storage', subtitle: 'Photos & Videos', position: { x: 650, y: 180 }, color: '#7c2d12' },
    { id: 'stream', type: 'stream', name: 'Stream', subtitle: 'Live Video', position: { x: 650, y: 310 }, color: '#92400e' },
  ];

  const competitorShapes = getCompetitorArchitecture(input.competitors[0], 'social', scale);

  return {
    cloudflare: {
      shapes: cloudflareShapes,
      arrows: [
        { id: 's1', from: 'mobile', to: 'cdn', label: 'Post Content', color: '#f97316', style: 'solid' as const },
        { id: 's2', from: 'web', to: 'cdn', label: 'Browse Feed', color: '#f97316', style: 'solid' as const },
        { id: 's3', from: 'cdn', to: 'workers', label: 'Route Requests', color: '#f97316', style: 'solid' as const },
        { id: 's4', from: 'workers', to: 'durable', label: 'Join Chat', color: '#f97316', style: 'solid' as const },
        { id: 's5', from: 'workers', to: 'd1', label: 'Store Posts', color: '#f97316', style: 'solid' as const },
        { id: 's6', from: 'workers', to: 'r2', label: 'Upload Media', color: '#f97316', style: 'solid' as const },
        { id: 's7', from: 'workers', to: 'stream', label: 'Start Live', color: '#f97316', style: 'solid' as const },
      ],
      labels: [
        { id: 'l1', text: 'Real-time at Edge', position: { x: 50, y: 350 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Global State Sync', position: { x: 350, y: 350 }, size: 'medium' as const, color: '#ea580c' },
      ]
    },
    competitor: {
      shapes: competitorShapes,
      arrows: getCompetitorArrows(input.competitors[0], 'social'),
      labels: [
        { id: 'l1', text: 'Complex Setup', position: { x: 50, y: 350 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Regional Latency', position: { x: 350, y: 350 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const generateAPIArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  const cloudflareShapes = [
    { id: 'clients', type: 'clients', name: 'API Clients', subtitle: 'Mobile/Web/3rd Party', position: { x: 50, y: 115 }, color: '#f97316' },
    { id: 'gateway', type: 'cdn', name: 'API Gateway', subtitle: 'Rate Limiting & Auth', position: { x: 250, y: 115 }, color: '#ea580c' },
    { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Business Logic', position: { x: 450, y: 115 }, color: '#dc2626' },
    { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Primary Data', position: { x: 650, y: 50 }, color: '#b91c1c' },
    { id: 'kv', type: 'kv', name: 'Workers KV', subtitle: 'Cache Layer', position: { x: 650, y: 180 }, color: '#991b1b' },
    { id: 'r2', type: 'r2', name: 'R2 Storage', subtitle: 'File Storage', position: { x: 450, y: 250 }, color: '#7c2d12' },
  ];

  if (scale === 'Enterprise' || scale === 'Global') {
    cloudflareShapes.push(
      { id: 'analytics', type: 'analytics', name: 'Analytics', subtitle: 'API Metrics', position: { x: 250, y: 250 }, color: '#92400e' },
      { id: 'queues', type: 'webhooks', name: 'Queues', subtitle: 'Async Processing', position: { x: 650, y: 310 }, color: '#a16207' }
    );
  }

  return {
    cloudflare: {
      shapes: cloudflareShapes,
      arrows: [
        { id: 'a1', from: 'clients', to: 'gateway', label: 'HTTPS', color: '#f97316', style: 'solid' as const },
        { id: 'a2', from: 'gateway', to: 'workers', label: 'Validated Requests', color: '#f97316', style: 'solid' as const },
        { id: 'a3', from: 'workers', to: 'd1', label: 'SQL Queries', color: '#f97316', style: 'solid' as const },
        { id: 'a4', from: 'workers', to: 'kv', label: 'Cache Read/Write', color: '#f97316', style: 'solid' as const },
        { id: 'a5', from: 'workers', to: 'r2', label: 'File Operations', color: '#f97316', style: 'solid' as const },
      ],
      labels: [
        { id: 'l1', text: 'Sub-millisecond Response', position: { x: 50, y: 350 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Auto-scaling', position: { x: 350, y: 350 }, size: 'medium' as const, color: '#ea580c' },
      ]
    },
    competitor: {
      shapes: getCompetitorArchitecture(input.competitors[0], 'api', scale),
      arrows: getCompetitorArrows(input.competitors[0], 'api'),
      labels: [
        { id: 'l1', text: 'Cold Start Penalty', position: { x: 50, y: 350 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Complex Scaling', position: { x: 350, y: 350 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const generateCMSArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  return {
    cloudflare: {
      shapes: [
        { id: 'editors', type: 'users', name: 'Content Editors', subtitle: 'Admin Panel', position: { x: 50, y: 50 }, color: '#f97316' },
        { id: 'visitors', type: 'users', name: 'Visitors', subtitle: 'Global Audience', position: { x: 50, y: 180 }, color: '#f97316' },
        { id: 'pages', type: 'pages', name: 'Pages', subtitle: 'Static Site', position: { x: 250, y: 115 }, color: '#ea580c' },
        { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'CMS API', position: { x: 450, y: 115 }, color: '#dc2626' },
        { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Content Store', position: { x: 650, y: 50 }, color: '#b91c1c' },
        { id: 'r2', type: 'r2', name: 'R2 Storage', subtitle: 'Media Assets', position: { x: 650, y: 180 }, color: '#991b1b' },
        { id: 'images', type: 'images', name: 'Images', subtitle: 'Optimization', position: { x: 450, y: 250 }, color: '#7c2d12' },
      ],
      arrows: [
        { id: 'a1', from: 'editors', to: 'workers', label: 'Content API', color: '#f97316', style: 'solid' as const },
        { id: 'a2', from: 'visitors', to: 'pages', label: 'Static Content', color: '#f97316', style: 'solid' as const },
        { id: 'a3', from: 'pages', to: 'workers', label: 'Dynamic Data', color: '#f97316', style: 'solid' as const },
        { id: 'a4', from: 'workers', to: 'd1', label: 'Content CRUD', color: '#f97316', style: 'solid' as const },
        { id: 'a5', from: 'workers', to: 'r2', label: 'Media Upload', color: '#f97316', style: 'solid' as const },
        { id: 'a6', from: 'r2', to: 'images', label: 'Auto Optimize', color: '#f97316', style: 'solid' as const },
      ],
      labels: [
        { id: 'l1', text: 'Instant Publishing', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Global CDN', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#ea580c' },
      ]
    },
    competitor: {
      shapes: getCompetitorArchitecture(input.competitors[0], 'cms', scale),
      arrows: getCompetitorArrows(input.competitors[0], 'cms'),
      labels: [
        { id: 'l1', text: 'Build Times', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Cache Invalidation', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const generateRealtimeArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  return {
    cloudflare: {
      shapes: [
        { id: 'clients', type: 'users', name: 'Clients', subtitle: 'Real-time Apps', position: { x: 50, y: 115 }, color: '#f97316' },
        { id: 'websockets', type: 'cdn', name: 'WebSocket CDN', subtitle: 'Global Edge', position: { x: 250, y: 115 }, color: '#ea580c' },
        { id: 'durable', type: 'durable-objects', name: 'Durable Objects', subtitle: 'Stateful Logic', position: { x: 450, y: 115 }, color: '#dc2626' },
        { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Persistent Data', position: { x: 650, y: 50 }, color: '#b91c1c' },
        { id: 'kv', type: 'kv', name: 'Workers KV', subtitle: 'Session Store', position: { x: 650, y: 180 }, color: '#991b1b' },
        { id: 'analytics', type: 'analytics', name: 'Analytics', subtitle: 'Real-time Metrics', position: { x: 450, y: 250 }, color: '#7c2d12' },
      ],
      arrows: [
        { id: 'a1', from: 'clients', to: 'websockets', label: 'WebSocket', color: '#f97316', style: 'solid' as const },
        { id: 'a2', from: 'websockets', to: 'durable', label: 'State Sync', color: '#f97316', style: 'solid' as const },
        { id: 'a3', from: 'durable', to: 'd1', label: 'Persist', color: '#f97316', style: 'solid' as const },
        { id: 'a4', from: 'durable', to: 'kv', label: 'Session', color: '#f97316', style: 'solid' as const },
        { id: 'a5', from: 'durable', to: 'analytics', label: 'Events', color: '#f97316', style: 'solid' as const },
      ],
      labels: [
        { id: 'l1', text: 'Global State Consistency', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Zero Latency Sync', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#ea580c' },
      ]
    },
    competitor: {
      shapes: getCompetitorArchitecture(input.competitors[0], 'realtime', scale),
      arrows: getCompetitorArrows(input.competitors[0], 'realtime'),
      labels: [
        { id: 'l1', text: 'Complex State Management', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Regional Bottlenecks', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const generateAnalyticsArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  return {
    cloudflare: {
      shapes: [
        { id: 'sources', type: 'users', name: 'Data Sources', subtitle: 'Apps & APIs', position: { x: 50, y: 115 }, color: '#f97316' },
        { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Data Pipeline', position: { x: 250, y: 115 }, color: '#ea580c' },
        { id: 'analytics', type: 'analytics', name: 'Analytics Engine', subtitle: 'Real-time Processing', position: { x: 450, y: 115 }, color: '#dc2626' },
        { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Time Series', position: { x: 650, y: 50 }, color: '#b91c1c' },
        { id: 'kv', type: 'kv', name: 'Workers KV', subtitle: 'Aggregations', position: { x: 650, y: 180 }, color: '#991b1b' },
        { id: 'dashboard', type: 'web', name: 'Dashboard', subtitle: 'Visualization', position: { x: 450, y: 250 }, color: '#7c2d12' },
      ],
      arrows: [
        { id: 'a1', from: 'sources', to: 'workers', label: 'Events', color: '#f97316', style: 'solid' as const },
        { id: 'a2', from: 'workers', to: 'analytics', label: 'Process', color: '#f97316', style: 'solid' as const },
        { id: 'a3', from: 'analytics', to: 'd1', label: 'Store', color: '#f97316', style: 'solid' as const },
        { id: 'a4', from: 'analytics', to: 'kv', label: 'Cache', color: '#f97316', style: 'solid' as const },
        { id: 'a5', from: 'analytics', to: 'dashboard', label: 'Real-time', color: '#f97316', style: 'solid' as const },
      ],
      labels: [
        { id: 'l1', text: 'Real-time Processing', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Global Data Collection', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#ea580c' },
      ]
    },
    competitor: {
      shapes: getCompetitorArchitecture(input.competitors[0], 'analytics', scale),
      arrows: getCompetitorArrows(input.competitors[0], 'analytics'),
      labels: [
        { id: 'l1', text: 'Batch Processing Delays', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Data Pipeline Complexity', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const generateGamingArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  return {
    cloudflare: {
      shapes: [
        { id: 'players', type: 'users', name: 'Players', subtitle: 'Global', position: { x: 50, y: 115 }, color: '#f97316' },
        { id: 'cdn', type: 'cdn', name: 'Game CDN', subtitle: 'Asset Delivery', position: { x: 250, y: 50 }, color: '#ea580c' },
        { id: 'durable', type: 'durable-objects', name: 'Durable Objects', subtitle: 'Game State', position: { x: 250, y: 180 }, color: '#dc2626' },
        { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Game Logic', position: { x: 450, y: 115 }, color: '#b91c1c' },
        { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Player Data', position: { x: 650, y: 50 }, color: '#991b1b' },
        { id: 'r2', type: 'r2', name: 'R2 Storage', subtitle: 'Game Assets', position: { x: 650, y: 180 }, color: '#7c2d12' },
        { id: 'analytics', type: 'analytics', name: 'Game Analytics', subtitle: 'Player Behavior', position: { x: 450, y: 250 }, color: '#92400e' },
      ],
      arrows: [
        { id: 'a1', from: 'players', to: 'cdn', label: 'Assets', color: '#f97316', style: 'solid' as const },
        { id: 'a2', from: 'players', to: 'durable', label: 'Game State', color: '#f97316', style: 'solid' as const },
        { id: 'a3', from: 'durable', to: 'workers', label: 'Logic', color: '#f97316', style: 'solid' as const },
        { id: 'a4', from: 'workers', to: 'd1', label: 'Player Data', color: '#f97316', style: 'solid' as const },
        { id: 'a5', from: 'cdn', to: 'r2', label: 'Asset Source', color: '#f97316', style: 'solid' as const },
        { id: 'a6', from: 'workers', to: 'analytics', label: 'Events', color: '#f97316', style: 'solid' as const },
      ],
      labels: [
        { id: 'l1', text: 'Ultra-low Latency', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Global State Sync', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#ea580c' },
      ]
    },
    competitor: {
      shapes: getCompetitorArchitecture(input.competitors[0], 'gaming', scale),
      arrows: getCompetitorArrows(input.competitors[0], 'gaming'),
      labels: [
        { id: 'l1', text: 'Regional Lag', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Complex Infrastructure', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const generateIoTArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  return {
    cloudflare: {
      shapes: [
        { id: 'devices', type: 'users', name: 'IoT Devices', subtitle: 'Sensors & Actuators', position: { x: 50, y: 115 }, color: '#f97316' },
        { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'Data Processing', position: { x: 250, y: 115 }, color: '#ea580c' },
        { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'Time Series', position: { x: 450, y: 50 }, color: '#dc2626' },
        { id: 'kv', type: 'kv', name: 'Workers KV', subtitle: 'Device State', position: { x: 450, y: 180 }, color: '#b91c1c' },
        { id: 'analytics', type: 'analytics', name: 'Analytics', subtitle: 'Real-time Insights', position: { x: 650, y: 115 }, color: '#991b1b' },
        { id: 'dashboard', type: 'web', name: 'Dashboard', subtitle: 'Monitoring', position: { x: 250, y: 250 }, color: '#7c2d12' },
      ],
      arrows: [
        { id: 'a1', from: 'devices', to: 'workers', label: 'Telemetry', color: '#f97316', style: 'solid' as const },
        { id: 'a2', from: 'workers', to: 'd1', label: 'Store', color: '#f97316', style: 'solid' as const },
        { id: 'a3', from: 'workers', to: 'kv', label: 'State', color: '#f97316', style: 'solid' as const },
        { id: 'a4', from: 'workers', to: 'analytics', label: 'Process', color: '#f97316', style: 'solid' as const },
        { id: 'a5', from: 'analytics', to: 'dashboard', label: 'Visualize', color: '#f97316', style: 'solid' as const },
      ],
      labels: [
        { id: 'l1', text: 'Edge Processing', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Real-time Analytics', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#ea580c' },
      ]
    },
    competitor: {
      shapes: getCompetitorArchitecture(input.competitors[0], 'iot', scale),
      arrows: getCompetitorArrows(input.competitors[0], 'iot'),
      labels: [
        { id: 'l1', text: 'Centralized Processing', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Higher Latency', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const generateWebAppArchitecture = (scale: UserInput['scale'], input: UserInput) => {
  return {
    cloudflare: {
      shapes: [
        { id: 'users', type: 'users', name: 'Users', subtitle: 'Global', position: { x: 50, y: 115 }, color: '#f97316' },
        { id: 'pages', type: 'pages', name: 'Pages', subtitle: 'Frontend', position: { x: 250, y: 50 }, color: '#ea580c' },
        { id: 'workers', type: 'workers', name: 'Workers', subtitle: 'API', position: { x: 250, y: 180 }, color: '#dc2626' },
        { id: 'd1', type: 'd1', name: 'D1 Database', subtitle: 'App Data', position: { x: 450, y: 115 }, color: '#b91c1c' },
        { id: 'kv', type: 'kv', name: 'Workers KV', subtitle: 'Cache', position: { x: 450, y: 250 }, color: '#991b1b' },
        { id: 'r2', type: 'r2', name: 'R2 Storage', subtitle: 'Assets', position: { x: 650, y: 115 }, color: '#7c2d12' },
      ],
      arrows: [
        { id: 'a1', from: 'users', to: 'pages', label: 'HTTPS', color: '#f97316', style: 'solid' as const },
        { id: 'a2', from: 'pages', to: 'workers', label: 'API Calls', color: '#f97316', style: 'solid' as const },
        { id: 'a3', from: 'workers', to: 'd1', label: 'Queries', color: '#f97316', style: 'solid' as const },
        { id: 'a4', from: 'workers', to: 'kv', label: 'Cache', color: '#f97316', style: 'solid' as const },
        { id: 'a5', from: 'workers', to: 'r2', label: 'Files', color: '#f97316', style: 'solid' as const },
      ],
      labels: [
        { id: 'l1', text: 'Full-stack Edge', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#f97316' },
        { id: 'l2', text: 'Zero Configuration', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#ea580c' },
      ]
    },
    competitor: {
      shapes: getCompetitorArchitecture(input.competitors[0], 'webapp', scale),
      arrows: getCompetitorArrows(input.competitors[0], 'webapp'),
      labels: [
        { id: 'l1', text: 'Complex Setup', position: { x: 50, y: 300 }, size: 'medium' as const, color: '#dc2626' },
        { id: 'l2', text: 'Regional Limitations', position: { x: 350, y: 300 }, size: 'medium' as const, color: '#dc2626' },
      ]
    }
  };
};

const getCompetitorArchitecture = (competitor: string, appType: string, scale: UserInput['scale']) => {
  const baseShapes = {
    AWS: [
      { id: 'users', type: 'users', name: 'Users', subtitle: 'Regional', position: { x: 50, y: 115 }, color: '#6b7280' },
      { id: 'cloudfront', type: 'cdn', name: 'CloudFront', subtitle: 'CDN', position: { x: 250, y: 50 }, color: '#6b7280' },
      { id: 'alb', type: 'service', name: 'ALB', subtitle: 'Load Balancer', position: { x: 250, y: 180 }, color: '#6b7280' },
      { id: 'lambda', type: 'function', name: 'Lambda', subtitle: 'Functions', position: { x: 450, y: 115 }, color: '#6b7280' },
      { id: 'rds', type: 'database', name: 'RDS', subtitle: 'Database', position: { x: 650, y: 50 }, color: '#6b7280' },
      { id: 's3', type: 'storage', name: 'S3', subtitle: 'Storage', position: { x: 650, y: 180 }, color: '#6b7280' },
    ],
    GCP: [
      { id: 'users', type: 'users', name: 'Users', subtitle: 'Regional', position: { x: 50, y: 115 }, color: '#6b7280' },
      { id: 'cdn', type: 'cdn', name: 'Cloud CDN', subtitle: 'CDN', position: { x: 250, y: 50 }, color: '#6b7280' },
      { id: 'lb', type: 'service', name: 'Load Balancer', subtitle: 'Global LB', position: { x: 250, y: 180 }, color: '#6b7280' },
      { id: 'functions', type: 'function', name: 'Cloud Functions', subtitle: 'Serverless', position: { x: 450, y: 115 }, color: '#6b7280' },
      { id: 'sql', type: 'database', name: 'Cloud SQL', subtitle: 'Database', position: { x: 650, y: 50 }, color: '#6b7280' },
      { id: 'storage', type: 'storage', name: 'Cloud Storage', subtitle: 'Object Store', position: { x: 650, y: 180 }, color: '#6b7280' },
    ],
    Azure: [
      { id: 'users', type: 'users', name: 'Users', subtitle: 'Regional', position: { x: 50, y: 115 }, color: '#6b7280' },
      { id: 'cdn', type: 'cdn', name: 'Azure CDN', subtitle: 'CDN', position: { x: 250, y: 50 }, color: '#6b7280' },
      { id: 'gateway', type: 'service', name: 'App Gateway', subtitle: 'Load Balancer', position: { x: 250, y: 180 }, color: '#6b7280' },
      { id: 'functions', type: 'function', name: 'Azure Functions', subtitle: 'Serverless', position: { x: 450, y: 115 }, color: '#6b7280' },
      { id: 'sql', type: 'database', name: 'Azure SQL', subtitle: 'Database', position: { x: 650, y: 50 }, color: '#6b7280' },
      { id: 'storage', type: 'storage', name: 'Blob Storage', subtitle: 'Object Store', position: { x: 650, y: 180 }, color: '#6b7280' },
    ],
    Vercel: [
      { id: 'users', type: 'users', name: 'Users', subtitle: 'Global', position: { x: 50, y: 115 }, color: '#6b7280' },
      { id: 'edge', type: 'cdn', name: 'Edge Network', subtitle: 'CDN', position: { x: 250, y: 115 }, color: '#6b7280' },
      { id: 'functions', type: 'function', name: 'Serverless Functions', subtitle: 'API', position: { x: 450, y: 115 }, color: '#6b7280' },
      { id: 'database', type: 'database', name: 'External DB', subtitle: 'Third-party', position: { x: 650, y: 115 }, color: '#6b7280' },
    ],
    Netlify: [
      { id: 'users', type: 'users', name: 'Users', subtitle: 'Global', position: { x: 50, y: 115 }, color: '#6b7280' },
      { id: 'cdn', type: 'cdn', name: 'Netlify CDN', subtitle: 'CDN', position: { x: 250, y: 115 }, color: '#6b7280' },
      { id: 'functions', type: 'function', name: 'Netlify Functions', subtitle: 'Lambda', position: { x: 450, y: 115 }, color: '#6b7280' },
      { id: 'database', type: 'database', name: 'External DB', subtitle: 'Third-party', position: { x: 650, y: 115 }, color: '#6b7280' },
    ],
    Railway: [
      { id: 'users', type: 'users', name: 'Users', subtitle: 'Regional', position: { x: 50, y: 115 }, color: '#6b7280' },
      { id: 'proxy', type: 'service', name: 'Railway Proxy', subtitle: 'Load Balancer', position: { x: 250, y: 115 }, color: '#6b7280' },
      { id: 'service', type: 'service', name: 'Railway Service', subtitle: 'Container', position: { x: 450, y: 115 }, color: '#6b7280' },
      { id: 'database', type: 'database', name: 'Railway DB', subtitle: 'PostgreSQL', position: { x: 650, y: 115 }, color: '#6b7280' },
    ],
    Render: [
      { id: 'users', type: 'users', name: 'Users', subtitle: 'Regional', position: { x: 50, y: 115 }, color: '#6b7280' },
      { id: 'cdn', type: 'cdn', name: 'Render CDN', subtitle: 'CDN', position: { x: 250, y: 115 }, color: '#6b7280' },
      { id: 'service', type: 'service', name: 'Render Service', subtitle: 'Container', position: { x: 450, y: 115 }, color: '#6b7280' },
      { id: 'database', type: 'database', name: 'Render DB', subtitle: 'PostgreSQL', position: { x: 650, y: 115 }, color: '#6b7280' },
    ],
    Supabase: [
      { id: 'users', type: 'users', name: 'Users', subtitle: 'Global', position: { x: 50, y: 115 }, color: '#6b7280' },
      { id: 'cdn', type: 'cdn', name: 'Supabase CDN', subtitle: 'CDN', position: { x: 250, y: 115 }, color: '#6b7280' },
      { id: 'functions', type: 'function', name: 'Edge Functions', subtitle: 'Deno Runtime', position: { x: 450, y: 115 }, color: '#6b7280' },
      { id: 'database', type: 'database', name: 'Supabase DB', subtitle: 'PostgreSQL', position: { x: 650, y: 115 }, color: '#6b7280' },
    ],
  };

  return baseShapes[competitor as keyof typeof baseShapes] || baseShapes.AWS;
};

const getCompetitorArrows = (competitor: string, appType: string) => {
  const baseArrows = [
    { id: 'c1', from: 'users', to: 'cdn', label: 'HTTPS', color: '#6b7280', style: 'solid' as const },
    { id: 'c2', from: 'cdn', to: 'functions', label: 'Route', color: '#6b7280', style: 'solid' as const },
    { id: 'c3', from: 'functions', to: 'database', label: 'Query', color: '#6b7280', style: 'dashed' as const },
  ];

  // Add more specific arrows based on competitor and app type
  if (competitor === 'AWS') {
    return [
      { id: 'aws1', from: 'users', to: 'cloudfront', label: 'HTTPS', color: '#6b7280', style: 'solid' as const },
      { id: 'aws2', from: 'cloudfront', to: 'alb', label: 'Route', color: '#6b7280', style: 'solid' as const },
      { id: 'aws3', from: 'alb', to: 'lambda', label: 'Invoke', color: '#6b7280', style: 'solid' as const },
      { id: 'aws4', from: 'lambda', to: 'rds', label: 'SQL', color: '#6b7280', style: 'dashed' as const },
      { id: 'aws5', from: 'lambda', to: 's3', label: 'Files', color: '#6b7280', style: 'dashed' as const },
    ];
  }

  return baseArrows;
};

export const generateArchitecture = async (input: UserInput): Promise<ArchitectureResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const systemDesign = getSystemDesign(input);
  
  const getPersonaAdvantages = (persona: UserInput['persona'], scale: UserInput['scale']) => {
    const baseAdvantages = {
      'Vibe Coder': [
        "Deploy in 30 seconds vs 30 minutes: Skip Docker, Kubernetes, and infrastructure setup. Push code, get global deployment instantly.",
        "Zero configuration scaling: Your app automatically handles 1 user or 1 million users without touching a single config file.",
        "Built-in everything: Database, storage, CDN, and compute in one platform. No vendor juggling or integration headaches."
      ],
      'FDE': [
        "Native TypeScript support: Full-stack TypeScript with zero build configuration. Deploy frontend and backend with the same language.",
        "Edge-first performance: 95% faster load times with automatic caching and optimization across 300+ global locations.",
        "Developer experience: Hot reloading, instant previews, and integrated debugging tools that actually work."
      ],
      'CIO/CTO': [
        "80% cost reduction: No data egress fees, no idle server costs. Pay only for actual usage, not peak capacity planning.",
        "Enterprise security by default: Built-in DDoS protection, WAF, and compliance certifications without additional licensing.",
        "99.99% uptime guarantee: Distributed architecture eliminates single points of failure. Your app stays online even during outages."
      ]
    };

    // Add scale-specific advantages
    const scaleAdvantages = {
      'Startup': " Perfect for MVPs with instant global reach.",
      'Growth': " Scales automatically as your user base grows.",
      'Enterprise': " Enterprise-grade security and compliance built-in.",
      'Global': " Handles millions of users across all continents seamlessly."
    };

    return baseAdvantages[persona].map(advantage => 
      advantage + scaleAdvantages[scale]
    );
  };

  const advantages = getPersonaAdvantages(input.persona, input.scale);

  return {
    cloudflare: systemDesign.cloudflare,
    competitor: systemDesign.competitor,
    advantages
  };
};