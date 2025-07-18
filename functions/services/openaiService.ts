interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ArchitectureNode {
  id: string;
  type: string;
  name: string;
  subtitle: string;
  position: { x: number; y: number };
  color: string;
}

interface ArchitectureEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  color: string;
  style: 'solid' | 'dashed';
}

interface ConstraintValueProp {
  emoji: string;
  title: string;
  description: string;
}

export class OpenAIService {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, options?: { accountId?: string; gatewayId?: string }) {
    this.apiKey = apiKey;
    
    // Use AI Gateway if credentials provided
    if (options?.accountId && options?.gatewayId) {
      this.apiUrl = `https://gateway.ai.cloudflare.com/v1/${options.accountId}/${options.gatewayId}/openai/chat/completions`;
    } else {
      this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }
  }

  private async callOpenAI(messages: Array<{ role: string; content: string }>, temperature = 0.7): Promise<string> {
    const requestBody = {
      model: 'gpt-4-turbo-preview',
      messages,
      temperature,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    };

    console.log('🚀 OpenAI Request:', {
      url: this.apiUrl,
      model: requestBody.model,
      temperature: requestBody.temperature,
      messagesCount: messages.length,
      messages: messages.map(m => ({ role: m.role, contentLength: m.content.length }))
    });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: OpenAIResponse = await response.json();
    console.log('✅ OpenAI Response:', {
      choices: data.choices.length,
      contentLength: data.choices[0]?.message?.content?.length || 0,
      contentPreview: data.choices[0]?.message?.content?.substring(0, 200) + '...'
    });
    
    return data.choices[0].message.content;
  }


  async generateCloudflareArchitecture(input: {
    appDescription: string;
    persona: string;
    scale: string;
    constraints: string[];
    region: string;
  }): Promise<{ nodes: ArchitectureNode[]; edges: ArchitectureEdge[]; advantages?: string[]; valueProps?: string[] }> {
    // Auto-select constraints if none provided
    const finalConstraints = input.constraints.length > 0 
      ? input.constraints 
      : this.selectConstraints(input.persona);
    const systemPrompt = `You are an expert cloud architect specializing in Cloudflare's edge computing platform. 
Generate architectures that showcase Cloudflare's unique advantages: zero egress fees, global edge network, integrated services, and serverless compute.

Available priorities for context:
- Cost Optimization (💰): Reduce cloud spend by half  
- Speed to Market (🚀): Deploy faster with zero DevOps
- Enterprise Security (🔒): Built-in DDoS protection and WAF
- Global Performance (🌍): Reach worldwide users in <50ms`;

    const userPrompt = `Generate a Cloudflare architecture for:
- Application: ${input.appDescription}
- User Type: ${input.persona}
- Scale: ${input.scale}
- Region: ${input.region}
- Key Constraints: ${finalConstraints.join(', ')}

Create a realistic architecture using Cloudflare services. Return JSON with:
{
  "nodes": [
    {
      "id": "unique_id",
      "type": "service_type",
      "name": "Service Name",
      "subtitle": "Brief description",
      "position": {"x": number, "y": number},
      "color": "#f97316"
    }
  ],
  "edges": [
    {
      "id": "edge_id",
      "from": "source_node_id",
      "to": "target_node_id",
      "label": "Connection type",
      "color": "#f97316",
      "style": "solid"
    }
  ],
  "advantages": [
    "3-4 specific advantages of using Cloudflare for this architecture",
    "Each advantage should highlight a unique benefit",
    "Focus on performance, cost, or developer experience"
  ],
  "valueProps": [
    "3-4 value propositions specific to ${input.persona}",
    "Each should be 1-2 sentences with concrete benefits",
    "Include metrics where possible"
  ]
}

Available Cloudflare service types:
- users: End users
- pages: Cloudflare Pages (static hosting)
- workers: Cloudflare Workers (edge compute)
- d1: D1 Database (distributed SQLite)
- r2: R2 Storage (zero egress object storage)
- kv: Workers KV (key-value storage)
- durable-objects: Durable Objects (stateful edge compute)
- analytics: Cloudflare Analytics
- security: Security features (WAF, DDoS)
- cdn: CDN/Edge Network
- ai: Workers AI

Position nodes logically with users on the left (x:50), progressing to backend services on the right.
Use y-coordinates to separate layers (100 for main flow, 250 for data layer).`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.callOpenAI(messages, 0.8);
    return JSON.parse(response);
  }

  async generateCompetitorArchitecture(input: {
    competitor: string;
    appDescription: string;
    persona: string;
    scale: string;
    region: string;
  }): Promise<{ nodes: ArchitectureNode[]; edges: ArchitectureEdge[] }> {
    const competitorServices = {
      'AWS': {
        types: 'ec2, lambda, rds, s3, cloudfront, alb, api-gateway, dynamodb, sqs, elasticache',
        color: '#FF9900'
      },
      'Azure': {
        types: 'app-service, functions, sql-database, blob-storage, cdn, application-gateway, cosmos-db, service-bus',
        color: '#0078D4'
      },
      'Google Cloud': {
        types: 'compute-engine, cloud-functions, cloud-sql, cloud-storage, cloud-cdn, load-balancer, firestore, pub-sub',
        color: '#4285F4'
      },
      'Vercel': {
        types: 'edge-functions, serverless-functions, postgres, blob-storage, edge-config, analytics',
        color: '#000000'
      },
      'Netlify': {
        types: 'functions, edge-handlers, forms, identity, analytics, cdn',
        color: '#00AD9F'
      }
    };

    const competitorInfo = competitorServices[input.competitor] || competitorServices['AWS'];

    const systemPrompt = `You are an expert cloud architect. Generate a traditional ${input.competitor} architecture that represents how most companies would build this application.
Show the complexity, multiple services, and potential inefficiencies compared to edge-native solutions.`;

    const userPrompt = `Generate a ${input.competitor} architecture for:
- Application: ${input.appDescription}
- Scale: ${input.scale}
- Region: ${input.region}

Create a realistic architecture showing typical ${input.competitor} patterns. Return JSON with:
{
  "nodes": [
    {
      "id": "unique_id",
      "type": "service_type",
      "name": "Service Name",
      "subtitle": "Brief description",
      "position": {"x": number, "y": number},
      "color": "#6b7280"
    }
  ],
  "edges": [
    {
      "id": "edge_id",
      "from": "source_node_id",
      "to": "target_node_id",
      "label": "Connection type",
      "color": "#6b7280",
      "style": "solid"
    }
  ]
}

Use gray color (#6b7280) for all ${input.competitor} services.
Available ${input.competitor} service types: ${competitorInfo.types}
Add "users" as the entry point.

Show realistic complexity including load balancers, multiple service layers, and data stores.
Position nodes logically with users on the left, progressing to backend services on the right.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.callOpenAI(messages, 0.8);
    return JSON.parse(response);
  }

  // Auto-assign priorities based on persona
  public selectConstraints(persona: string): string[] {
    const personaMapping = {
      'Vibe Coder': ['Speed to Market', 'Cost Optimization', 'Global Performance'],
      'FDE': ['Global Performance', 'Speed to Market', 'Cost Optimization'],
      'CIO/CTO': ['Enterprise Security', 'Cost Optimization', 'Global Performance']
    };

    return personaMapping[persona as keyof typeof personaMapping] || ['Global Performance', 'Cost Optimization', 'Speed to Market'];
  }

  async generateConstraintAdvantages(input: {
    constraints: string[];
    appDescription: string;
    competitor: string;
    cloudflareArch: { nodes: ArchitectureNode[]; edges: ArchitectureEdge[] };
    competitorArch: { nodes: ArchitectureNode[]; edges: ArchitectureEdge[] };
  }): Promise<ConstraintValueProp[]> {
    const systemPrompt = `You are a cloud architecture expert. Generate exactly ${input.constraints.length} concise value propositions comparing Cloudflare to ${input.competitor}.

REQUIREMENTS:
1. Return EXACTLY ${input.constraints.length} objects in a JSON array
2. Each description must be 1-2 sentences maximum
3. Include specific metrics or concrete benefits
4. Focus on architectural differences between the two platforms`;

    const userPrompt = `Compare these architectures for "${input.appDescription}":

Cloudflare: ${input.cloudflareArch.nodes.map(n => n.name).join(', ')}
${input.competitor}: ${input.competitorArch.nodes.map(n => n.name).join(', ')}

Generate ${input.constraints.length} value propositions, one for each priority:
${input.constraints.map((c, i) => {
  const priorityMap = {
    'Global Performance': { emoji: '🌍', title: 'Global Performance' },
    'Cost Optimization': { emoji: '💰', title: 'Cost Optimization' },
    'Enterprise Security': { emoji: '🔒', title: 'Enterprise Security' },
    'Speed to Market': { emoji: '🚀', title: 'Speed to Market' }
  };
  const priority = priorityMap[c as keyof typeof priorityMap] || { emoji: '✅', title: 'Cloudflare Advantage' };
  return `${i+1}. ${c} (emoji: "${priority.emoji}", title: "${priority.title}")`;
}).join('\n')}

Return JSON array with exactly ${input.constraints.length} objects:
[{
  "emoji": "🌍",
  "title": "Global Performance",
  "description": "Cloudflare's 300+ edge locations deliver <50ms latency worldwide vs ${input.competitor}'s regional delays of 200ms+."
}]

Each description must:
- Be 1 sentence maximum
- Follow format: "Cloudflare's [feature] means [business outcome] unlike [competitor's limitation]"
- Include specific metrics (%, ms, $, etc.)
- Focus on business value, not technical features`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.callOpenAI(messages, 0.7);
    console.log('🔧 Raw OpenAI response for constraint advantages:', response);
    console.log('🔧 Response type:', typeof response);
    console.log('🔧 Response trimmed:', response.trim());
    
    try {
      const parsed = JSON.parse(response.trim());
      console.log('✅ Successfully parsed constraint advantages:', parsed);
      return parsed;
    } catch (error) {
      console.error('❌ Failed to parse constraint advantages JSON:', error);
      console.error('❌ Raw response was:', response);
      throw error;
    }
  }
}