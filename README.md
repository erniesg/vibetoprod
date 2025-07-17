# vibetoprod

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/erniesg/vibetoprod)

## Development

### Running the Application

This project uses Cloudflare Workers with a Hono backend to serve both the API and static assets.

```bash
# Install dependencies
npm install

# Build and run with Cloudflare Workers (includes backend)
npm run dev:wrangler

# The app will be available at http://localhost:8787
```

### Streaming Mode

Visit `http://localhost:8787?streaming=true` to access the streaming architecture generation feature.

### Other Commands

```bash
# Build only
npm run build

# Deploy to Cloudflare Workers
npm run deploy

# Run linter
npm run lint
```