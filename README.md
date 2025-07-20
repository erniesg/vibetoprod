# VibeToProd: The Edge Advantage

An interactive streaming architecture comparison tool that demonstrates Cloudflare's advantages over traditional cloud providers through dynamic visualizations.

[Edit in StackBlitz ⚡️](https://stackblitz.com/~/github.com/erniesg/vibetoprod)

## Features

- **Real-time Architecture Generation**: AI-powered streaming architecture diagrams
- **Multi-Persona Support**: Tailored for Vibe Coders, AIE/FDE, and CIO/CTO personas
- **Interactive Comparisons**: Side-by-side Cloudflare vs competitor architectures
- **Constraint-Based Optimization**: Generate architectures based on specific business constraints
- **Whitepaper Mode**: Comprehensive documentation view with `?whitepaper=true`

## Development

### Prerequisites

- Node.js 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- OpenAI API key

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .dev.vars file with:
# OPENAI_API_KEY=sk-your-openai-api-key

# Build and run locally with Cloudflare Workers
npm run dev:wrangler
# OR use local mode for faster development
wrangler dev --local --port 8787

# The app will be available at http://localhost:8787
```

### Accessing Features

- **Landing Page**: `http://localhost:8787`
- **Whitepaper**: `http://localhost:8787?whitepaper=true`
- **API Health**: `http://localhost:8787/api/health`

### Other Commands

```bash
# Build frontend only
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Deployment to Cloudflare Workers

### Prerequisites Setup

1. **Install and authenticate Wrangler**:
```bash
npm install -g wrangler
wrangler auth login
```

2. **Set OpenAI API Key Secret**:
```bash
# Set your OpenAI API key as a secret
wrangler secret put OPENAI_API_KEY
# Enter your sk-... key when prompted
```

### Deploy to Production

```bash
# Build the application
npm run build

# Deploy to Cloudflare Workers (vibetoprod.your-subdomain.workers.dev)
npm run deploy
# OR
wrangler deploy

# Your app will be available at: https://vibetoprod.your-subdomain.workers.dev
```

### Environment Management

The project supports multiple environments via wrangler.toml:

- **Default Environment**: `wrangler deploy` → `vibetoprod.your-subdomain.workers.dev`
- **Production Environment**: `wrangler deploy --env=production` → `vibetoprod-production.your-subdomain.workers.dev`

### Deployment Verification

After deployment, verify everything works:

```bash
# Check API health
curl https://your-worker-url.workers.dev/api/health

# Test architecture generation
curl -X POST https://your-worker-url.workers.dev/api/generate-architecture-v2 \
  -H "Content-Type: application/json" \
  -d '{"appDescription":"test app","persona":"Vibe Coder"}'
```

### Troubleshooting Deployment

1. **OpenAI API Key Issues**:
```bash
# Verify secret is set
wrangler secret list

# Update secret if needed
wrangler secret put OPENAI_API_KEY
```

2. **View Live Logs**:
```bash
# Monitor real-time logs
wrangler tail

# Trigger API call in another terminal to see logs
```

3. **Environment Variable Debug**:
The app logs environment info when making API calls - check the console for debug information.

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Hono (Express-like framework for Workers)
- **Runtime**: Cloudflare Workers
- **AI**: OpenAI GPT-4 with Vercel AI SDK
- **Styling**: Tailwind CSS

### API Endpoints
- `GET /` - Serves the React SPA
- `GET /api/health` - Health check endpoint
- `POST /api/generate-architecture` - Legacy streaming API (v1)
- `POST /api/generate-architecture-v2` - Modern streaming API with AI SDK

### File Structure
```
vibetoprod/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Frontend services
│   └── types/             # TypeScript definitions
├── functions/             # Cloudflare Workers backend
│   ├── [[route]].ts       # Main worker entry point
│   └── services/          # Backend services
├── dist/                  # Built frontend assets
└── wrangler.toml         # Cloudflare Workers configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test locally
4. Build and test: `npm run build && npm run lint`
5. Commit and push: `git commit -m "Add feature" && git push`
6. Create a Pull Request

## License

MIT License - see LICENSE file for details.