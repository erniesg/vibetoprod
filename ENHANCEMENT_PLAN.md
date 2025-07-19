# VibeToProd Enhancement Plan: Persona Presets, Rate Limiting & Caching

## Overview
Enhance the existing VibeToProd streaming architecture with persona-based presets, global rate limiting, and intelligent caching system using Cloudflare's edge infrastructure.

## Requirements

### Functional Requirements
- [ ] **FR-1**: Provide 3 curated app presets per persona (Vibe Coder, AIE/FDE, CIO/CTO)
- [ ] **FR-2**: Each preset includes app description, scale, and 2-3 relevant constraints
- [ ] **FR-3**: Users can select presets OR enter custom input
- [ ] **FR-4**: Global rate limit of 100 generations with reset capability
- [ ] **FR-5**: Store all generations for future retrieval
- [ ] **FR-6**: When rate limit reached, search for similar cached results
- [ ] **FR-7**: Multiple admin reset options (API, CLI, Dashboard)

### Technical Requirements
- [ ] **TR-1**: Use existing `/api/generate-architecture-v2` endpoint only
- [ ] **TR-2**: Maintain current streaming response format
- [ ] **TR-3**: Hybrid storage: KV for counters, D1 for complex data
- [ ] **TR-4**: Vector similarity search with 0.85 threshold
- [ ] **TR-5**: No breaking changes to existing UI/UX

### Performance Requirements
- [ ] **PR-1**: Rate limit check must be <50ms
- [ ] **PR-2**: Cache retrieval must be <200ms
- [ ] **PR-3**: Vector search must complete within 1s
- [ ] **PR-4**: Preset selection updates form instantly

---

## Phase 1: UI Persona Presets

### Goal
Add preset dropdowns to existing streaming control panel

### Files to Create/Modify
- `src/constants/personaPresets.ts` (new)
- `src/components/streaming/StreamingControlPanel.tsx` (modify)

### Implementation Details

#### Create `src/constants/personaPresets.ts`:
```typescript
export const personaPresets = {
  'Vibe Coder': [
    { 
      label: "E-commerce Platform", 
      appDescription: "A high-traffic e-commerce platform with real-time inventory management",
      scale: "Growth" as const,
      constraints: ["Cost Optimization", "Global Performance", "Scalability"]
    },
    { 
      label: "Social Platform", 
      appDescription: "A social platform with live chat, video streaming, and real-time feeds",
      scale: "Enterprise" as const, 
      constraints: ["Scalability", "Global Performance", "Developer Velocity"]
    },
    { 
      label: "Collaborative Tool", 
      appDescription: "A collaborative whiteboard app with real-time multiplayer editing",
      scale: "Startup" as const,
      constraints: ["Developer Velocity", "Cost Optimization"]
    }
  ],
  'AIE/FDE': [
    { 
      label: "REST API Backend", 
      appDescription: "A REST API serving mobile apps with authentication and file uploads",
      scale: "Growth" as const,
      constraints: ["Developer Velocity", "Global Performance", "Scalability"]
    },
    { 
      label: "Analytics Dashboard", 
      appDescription: "A real-time analytics dashboard processing millions of events",
      scale: "Enterprise" as const,
      constraints: ["Scalability", "Global Performance", "Enterprise Security"]
    },
    { 
      label: "Headless CMS", 
      appDescription: "A headless CMS with global content delivery and media optimization",
      scale: "Growth" as const,
      constraints: ["Global Performance", "Developer Velocity"]
    }
  ],
  'CIO/CTO': [
    { 
      label: "Gaming Platform", 
      appDescription: "A multiplayer online game with real-time player interactions",
      scale: "Enterprise" as const,
      constraints: ["Global Performance", "Scalability", "Enterprise Security"]
    },
    { 
      label: "IoT Platform", 
      appDescription: "An IoT platform collecting sensor data from thousands of devices",
      scale: "Enterprise" as const,
      constraints: ["Scalability", "Enterprise Security", "Cost Optimization"]
    },
    { 
      label: "Enterprise SaaS", 
      appDescription: "Enterprise-grade SaaS platform with multi-tenant architecture",
      scale: "Global" as const,
      constraints: ["Enterprise Security", "Scalability", "Global Performance"]
    }
  ]
};

export type PersonaPreset = typeof personaPresets[keyof typeof personaPresets][0];
```

#### Modify `src/components/streaming/StreamingControlPanel.tsx`:
```typescript
// Add import
import { personaPresets } from '../../constants/personaPresets';

// Add to component state
const [selectedPreset, setSelectedPreset] = useState<string>('');

// Add preset selection handler
const handlePresetSelect = (presetLabel: string) => {
  const preset = personaPresets[currentPersona]?.find(p => p.label === presetLabel);
  if (preset) {
    setInput(prev => ({
      ...prev,
      appDescription: preset.appDescription,
      scale: preset.scale,
      constraints: preset.constraints
    }));
    setSelectedPreset(presetLabel);
  }
};

// Add preset dropdown in JSX before app description
<div className="space-y-2">
  <label className="block text-sm font-medium">
    Quick Start Templates
  </label>
  <select 
    value={selectedPreset}
    onChange={(e) => handlePresetSelect(e.target.value)}
    className="w-full px-4 py-3 rounded-lg border"
  >
    <option value="">Choose a template or enter custom...</option>
    {personaPresets[currentPersona]?.map(preset => (
      <option key={preset.label} value={preset.label}>
        {preset.label}
      </option>
    ))}
  </select>
</div>
```

### Todo List - Phase 1
- [ ] Create persona presets constants file
- [ ] Add preset dropdown to StreamingControlPanel
- [ ] Implement preset selection handler
- [ ] Clear preset selection when user types custom input
- [ ] Test preset selection updates all form fields
- [ ] Ensure preset selection works with auto-cycling personas

---

## Phase 2: Rate Limiting with KV

### Goal
Add 100-generation global limit using atomic KV operations

### Files to Modify
- `functions/[[route]].ts` (modify `/api/generate-architecture-v2` endpoint)
- `wrangler.toml` (ensure KV binding exists)

### Implementation Details

#### Modify `/api/generate-architecture-v2` endpoint in `functions/[[route]].ts`:
```typescript
// Add rate limit check at the beginning of the endpoint
const rateLimitKey = 'global_generation_count';
let currentCount = 0;

try {
  const countValue = await c.env.KV.get(rateLimitKey);
  currentCount = countValue ? parseInt(countValue) : 0;
} catch (error) {
  console.error('Rate limit check failed:', error);
  // Continue without rate limiting if KV fails
}

if (currentCount >= 100) {
  return c.json({ 
    error: 'Generation limit reached (100/100)', 
    count: currentCount,
    message: 'Contact admin to reset or try searching similar architectures',
    canReset: true,
    resetEndpoint: '/admin/reset'
  }, 429);
}

// ... existing generation logic ...

// After successful generation (before sending final response)
try {
  await c.env.KV.put(rateLimitKey, (currentCount + 1).toString());
  console.log(`✅ Generation count updated: ${currentCount + 1}/100`);
} catch (error) {
  console.error('Failed to update rate limit counter:', error);
  // Don't fail the request if counter update fails
}
```

#### Add to `wrangler.toml` (if not already present):
```toml
[[env.production.kv_namespaces]]
binding = "KV"
id = "your-existing-kv-namespace-id"

[[env.development.kv_namespaces]]
binding = "KV"
id = "your-dev-kv-namespace-id"
```

### Todo List - Phase 2
- [ ] Add rate limit check to v2 endpoint start
- [ ] Implement atomic counter increment after generation
- [ ] Add proper error handling for KV failures
- [ ] Test rate limit triggers at 100 generations
- [ ] Verify counter persists across deployments
- [ ] Add logging for rate limit events

---

## Phase 3: Admin Reset Endpoints

### Goal
Provide multiple ways to reset the generation counter

### Files to Modify
- `functions/[[route]].ts` (add new endpoint)
- `wrangler.toml` (add admin API key)

### Implementation Details

#### Add admin reset endpoint in `functions/[[route]].ts`:
```typescript
// Add new endpoint after existing endpoints
app.post('/admin/reset', async (c) => {
  try {
    const adminKey = c.req.header('X-Admin-Key');
    
    if (!adminKey || adminKey !== c.env.ADMIN_API_KEY) {
      return c.json({ 
        error: 'Unauthorized',
        message: 'Valid admin key required' 
      }, 401);
    }
    
    await c.env.KV.put('global_generation_count', '0');
    
    return c.json({ 
      success: true, 
      message: 'Generation counter reset to 0',
      resetAt: new Date().toISOString(),
      newCount: 0
    });
  } catch (error) {
    console.error('Admin reset failed:', error);
    return c.json({ 
      error: 'Reset failed',
      details: error.message 
    }, 500);
  }
});

// Add status endpoint for monitoring
app.get('/admin/status', async (c) => {
  try {
    const adminKey = c.req.header('X-Admin-Key');
    
    if (!adminKey || adminKey !== c.env.ADMIN_API_KEY) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const countValue = await c.env.KV.get('global_generation_count');
    const currentCount = countValue ? parseInt(countValue) : 0;
    
    return c.json({
      currentCount,
      limit: 100,
      remaining: Math.max(0, 100 - currentCount),
      status: currentCount >= 100 ? 'LIMITED' : 'ACTIVE'
    });
  } catch (error) {
    return c.json({ error: 'Status check failed' }, 500);
  }
});
```

#### Add to `wrangler.toml`:
```toml
[env.production.vars]
ADMIN_API_KEY = "your-secret-admin-key-here"
# ... existing vars

[env.development.vars]
ADMIN_API_KEY = "dev-admin-key"
# ... existing vars
```

### Reset Options Documentation

#### Method 1: API Endpoint
```bash
curl -X POST https://vibetoprod.dev/admin/reset \
  -H "X-Admin-Key: your-secret-admin-key"
```

#### Method 2: Wrangler CLI
```bash
wrangler kv:key put --binding=KV "global_generation_count" "0"
```

#### Method 3: Cloudflare Dashboard
1. Go to Workers & Pages > KV
2. Select your namespace
3. Find `global_generation_count` key
4. Edit value to `0`

### Todo List - Phase 3
- [ ] Add admin reset endpoint with authentication
- [ ] Add admin status endpoint for monitoring
- [ ] Generate and configure admin API key
- [ ] Test all three reset methods
- [ ] Document reset procedures
- [ ] Add rate limit status to admin dashboard

---

## Phase 4: Generation Storage in D1

### Goal
Store all successful generations for future retrieval

### Files to Modify
- `functions/[[route]].ts` (modify v2 endpoint)
- `wrangler.toml` (add D1 binding)

### Database Setup

#### Create D1 database:
```bash
wrangler d1 create vibetoprod-generations
```

#### Create schema:
```sql
CREATE TABLE generations (
  id TEXT PRIMARY KEY,
  input_hash TEXT UNIQUE,
  app_description TEXT NOT NULL,
  scale TEXT NOT NULL,
  constraints TEXT, -- JSON array as string
  persona TEXT NOT NULL,
  competitor TEXT,
  region TEXT,
  result_data TEXT NOT NULL, -- Complete JSON result
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  embedding_generated BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_input_hash ON generations(input_hash);
CREATE INDEX idx_persona_scale ON generations(persona, scale);
CREATE INDEX idx_created_at ON generations(created_at DESC);
```

### Implementation Details

#### Add to v2 endpoint after successful generation:
```typescript
// Generate consistent input hash
const inputString = [
  userInput.appDescription?.toLowerCase().trim(),
  userInput.scale,
  JSON.stringify(userInput.constraints?.sort()),
  userInput.persona,
  userInput.competitors?.[0] || 'AWS',
  userInput.region || 'Global'
].join('|');

const inputHash = await crypto.subtle.digest('SHA-256', 
  new TextEncoder().encode(inputString)
);
const hashString = Array.from(new Uint8Array(inputHash))
  .map(b => b.toString(16).padStart(2, '0')).join('');

// Store generation after streaming completes
try {
  await c.env.DB.prepare(`
    INSERT OR REPLACE INTO generations 
    (id, input_hash, app_description, scale, constraints, persona, competitor, region, result_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(),
    hashString,
    userInput.appDescription,
    userInput.scale,
    JSON.stringify(userInput.constraints || []),
    userInput.persona,
    userInput.competitors?.[0] || 'AWS',
    userInput.region || 'Global',
    JSON.stringify({
      cloudflare: result.cloudflare,
      competitor: result.competitor,
      advantages: result.advantages,
      timestamp: Date.now()
    })
  ).run();
  
  console.log(`💾 Stored generation with hash: ${hashString}`);
} catch (error) {
  console.error('Failed to store generation:', error);
  // Don't fail the request if storage fails
}
```

#### Add to `wrangler.toml`:
```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "vibetoprod-generations"
database_id = "your-d1-database-id"

[[env.development.d1_databases]]
binding = "DB"
database_name = "vibetoprod-generations-dev"
database_id = "your-dev-d1-database-id"
```

### Todo List - Phase 4
- [ ] Create D1 database and get IDs
- [ ] Run schema creation commands
- [ ] Add D1 bindings to wrangler.toml
- [ ] Implement generation storage logic
- [ ] Add input hashing function
- [ ] Test storage with different input variations
- [ ] Verify stored data integrity
- [ ] Add error handling for storage failures

---

## Phase 5: Vector Similarity Search

### Goal
When rate limited, search for similar cached generations

### Files to Modify
- `functions/[[route]].ts` (enhance rate limit response)
- `wrangler.toml` (add Vectorize binding)

### Setup Vectorize

#### Create Vectorize index:
```bash
wrangler vectorize create generation-embeddings --dimensions=1536 --metric=cosine
```

### Implementation Details

#### Add embedding generation function:
```typescript
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 1536
    })
  });
  
  const data = await response.json();
  return data.data[0].embedding;
}
```

#### Enhance rate limit response:
```typescript
if (currentCount >= 100) {
  // Try to find similar cached generation
  const inputForEmbedding = `${userInput.appDescription} ${userInput.scale} ${userInput.constraints?.join(' ')} ${userInput.persona}`;
  
  try {
    console.log('🔍 Searching for similar cached generations...');
    
    const embedding = await generateEmbedding(inputForEmbedding, c.env.OPENAI_API_KEY);
    
    const similarResults = await c.env.VECTORIZE.query(embedding, {
      topK: 3,
      returnMetadata: true,
      returnValues: false
    });
    
    if (similarResults.matches.length > 0 && similarResults.matches[0].score > 0.85) {
      console.log(`✅ Found similar generation with score: ${similarResults.matches[0].score}`);
      
      // Get cached result from D1
      const cachedGeneration = await c.env.DB.prepare(
        "SELECT result_data FROM generations WHERE input_hash = ?"
      ).bind(similarResults.matches[0].id).first();
      
      if (cachedGeneration) {
        // Stream the cached result in same format
        return streamCachedResult(JSON.parse(cachedGeneration.result_data), c);
      }
    }
    
    console.log('❌ No similar generations found above threshold');
  } catch (error) {
    console.error('Vector search failed:', error);
  }
  
  return c.json({ 
    error: 'Generation limit reached (100/100)', 
    count: currentCount,
    message: 'No similar cached results found. Contact admin to reset limit.',
    canReset: true
  }, 429);
}
```

#### Add cached result streaming function:
```typescript
function streamCachedResult(cachedData: any, c: any) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      function sendChunk(chunk: any) {
        const line = `data: ${JSON.stringify(chunk)}\n\n`;
        controller.enqueue(encoder.encode(line));
      }
      
      // Simulate streaming the cached result
      setTimeout(() => {
        sendChunk({ type: 'cached_result', data: cachedData });
        sendChunk({ type: 'complete', cached: true });
        controller.close();
      }, 100);
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
}
```

#### Background job to generate embeddings:
```typescript
// Add endpoint to generate embeddings for existing generations
app.post('/admin/generate-embeddings', async (c) => {
  const adminKey = c.req.header('X-Admin-Key');
  if (!adminKey || adminKey !== c.env.ADMIN_API_KEY) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  // Get generations without embeddings
  const generations = await c.env.DB.prepare(
    "SELECT id, input_hash, app_description, scale, constraints, persona FROM generations WHERE embedding_generated = FALSE LIMIT 10"
  ).all();
  
  let processed = 0;
  
  for (const gen of generations.results) {
    try {
      const inputText = `${gen.app_description} ${gen.scale} ${gen.constraints} ${gen.persona}`;
      const embedding = await generateEmbedding(inputText, c.env.OPENAI_API_KEY);
      
      // Store in Vectorize
      await c.env.VECTORIZE.upsert([{
        id: gen.input_hash,
        values: embedding,
        metadata: { 
          generation_id: gen.id,
          persona: gen.persona,
          scale: gen.scale
        }
      }]);
      
      // Mark as processed
      await c.env.DB.prepare(
        "UPDATE generations SET embedding_generated = TRUE WHERE id = ?"
      ).bind(gen.id).run();
      
      processed++;
    } catch (error) {
      console.error(`Failed to process generation ${gen.id}:`, error);
    }
  }
  
  return c.json({ processed, remaining: generations.results.length - processed });
});
```

#### Add to `wrangler.toml`:
```toml
[[env.production.vectorize]]
binding = "VECTORIZE"
index_name = "generation-embeddings"

[[env.development.vectorize]]
binding = "VECTORIZE"
index_name = "generation-embeddings-dev"
```

### Todo List - Phase 5
- [ ] Create Vectorize index
- [ ] Add embedding generation function
- [ ] Implement similarity search in rate limit handler
- [ ] Add cached result streaming function
- [ ] Create admin endpoint for generating embeddings
- [ ] Test similarity search with various inputs
- [ ] Verify cached results stream correctly
- [ ] Add monitoring for vector search performance

---

## Testing Strategy

### Unit Tests
- [ ] Test persona preset selection updates form correctly
- [ ] Test rate limit counter increments properly
- [ ] Test input hashing produces consistent results
- [ ] Test embedding generation returns valid vectors

### Integration Tests
- [ ] Test full generation flow with rate limiting
- [ ] Test admin reset functionality
- [ ] Test cached result retrieval and streaming
- [ ] Test vector similarity search accuracy

### Load Tests
- [ ] Test rate limiting under concurrent requests
- [ ] Test KV atomic operations under load
- [ ] Test D1 storage performance
- [ ] Test Vectorize search performance

---

## Deployment Instructions

### Prerequisites
```bash
# Ensure Wrangler is installed and authenticated
npm install -g wrangler
wrangler auth login
```

### Step 1: Database Setup
```bash
# Create D1 database
wrangler d1 create vibetoprod-generations

# Create tables
wrangler d1 execute vibetoprod-generations --file=schema.sql

# Create Vectorize index
wrangler vectorize create generation-embeddings --dimensions=1536 --metric=cosine
```

### Step 2: Environment Configuration
```bash
# Generate admin API key
openssl rand -hex 32

# Update wrangler.toml with database IDs and API key
```

### Step 3: Deploy
```bash
# Deploy application
npm run build
wrangler pages deploy dist

# Generate embeddings for existing data (if any)
curl -X POST https://vibetoprod.dev/admin/generate-embeddings \
  -H "X-Admin-Key: your-admin-key"
```

---

## Monitoring & Maintenance

### Key Metrics to Monitor
- [ ] Generation count vs limit (current/100)
- [ ] Cache hit rate for similarity search
- [ ] Average response time for generations
- [ ] Vector search accuracy and performance
- [ ] D1 storage usage and query performance
- [ ] KV read/write operations

### Regular Maintenance Tasks
- [ ] Weekly: Review generation patterns and optimize presets
- [ ] Monthly: Analyze vector search performance and adjust thresholds
- [ ] Quarterly: Review and optimize D1 indices
- [ ] As needed: Reset rate limit counter based on usage

---

## Success Criteria

### Phase 1 Success
- [ ] Users can select persona presets
- [ ] Presets populate form fields correctly
- [ ] Custom input still works as before

### Phase 2 Success
- [ ] Rate limiting activates at 100 generations
- [ ] Counter persists across deployments
- [ ] Clear error message shown when limited

### Phase 3 Success
- [ ] Admin can reset via API, CLI, or dashboard
- [ ] Reset operation completes in <5 seconds
- [ ] Status endpoint shows accurate counts

### Phase 4 Success
- [ ] All generations stored successfully
- [ ] Data integrity maintained
- [ ] Storage doesn't impact response time

### Phase 5 Success
- [ ] Similar results found for >70% of repeat patterns
- [ ] Cached results stream in same format
- [ ] Search completes within 1 second

---

## Risk Mitigation

### High Risk Items
- **Rate limit counter race conditions**: Use KV atomic operations
- **D1 storage failures**: Don't fail generation if storage fails
- **Vector search timeouts**: Set reasonable timeouts and fallbacks
- **Admin key security**: Use strong keys and rotate regularly

### Rollback Plan
- [ ] Keep existing endpoint functional during implementation
- [ ] Feature flags for each phase
- [ ] Database migrations are additive only
- [ ] Quick rollback via environment variables

This plan provides a comprehensive roadmap for implementing all requested features while maintaining the existing architecture's stability and performance.