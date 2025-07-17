# OpenAI Integration Setup

## Setting up OpenAI API Key

1. **Get your OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (it starts with `sk-`)

2. **Add the API key to Cloudflare Workers**
   ```bash
   # For development
   wrangler secret put OPENAI_API_KEY
   # Paste your API key when prompted

   # For production (when ready)
   wrangler secret put OPENAI_API_KEY --env production
   ```

3. **Test locally**
   ```bash
   # Run the development server
   npm run dev
   
   # The app will automatically use OpenAI when the key is present
   ```

## How it works

- When `OPENAI_API_KEY` is present, the app uses GPT-4 to generate:
  - Cloudflare architecture based on your app description
  - Competitor architecture (AWS, Azure, etc.)
  - Constraint-based value propositions

- If OpenAI fails or is not configured, it falls back to mock data

## Toggling OpenAI

You can disable OpenAI without removing the key:
```bash
# In wrangler.toml, set:
USE_OPENAI = "false"
```

## Cost Considerations

- Each architecture generation uses ~1000-2000 tokens
- With GPT-4 Turbo: ~$0.02-0.04 per generation
- Consider implementing caching for common patterns