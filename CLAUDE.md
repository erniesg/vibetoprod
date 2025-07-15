# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

vibetoprod is a React TypeScript application built with Vite that creates interactive cloud architecture comparison diagrams. It showcases Cloudflare's advantages over traditional cloud providers through dynamic visualizations.

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Architecture Overview

The application follows a layered architecture:

1. **Components Layer** (`/src/components/`)
   - Feature components handle specific functionality (CompetitiveLandscape, DiagramCanvas, ControlPanel)
   - UI components in `/src/components/ui/` provide reusable elements using class-variance-authority

2. **Service Layer** (`/src/services/architectureService.ts`)
   - Contains core business logic for generating architecture diagrams
   - Handles app type detection and architecture generation for both Cloudflare and competitors
   - Implements persona-based advantages and scale-specific optimizations

3. **Type Definitions** (`/src/types/index.ts`)
   - Comprehensive TypeScript interfaces for UserInput, ArchitectureResponse, and diagram data structures

4. **Data Layer** (`/src/data/companyData.ts`)
   - Static data for company information, valuations, and competitive positioning

## Key Technologies

- **React 18.3** with TypeScript 5.5
- **Vite 5.4** for fast development and building
- **Tailwind CSS 3.4** for utility-first styling
- **Visualization Libraries**: @nivo/scatterplot, @xyflow/react, @tldraw/tldraw
- **Strict TypeScript** configuration with no unused variables allowed

## Development Guidelines

1. **Component Structure**: Follow existing patterns - feature components handle business logic, UI components stay pure
2. **TypeScript**: Maintain strict typing - the project has strict mode enabled
3. **Styling**: Use Tailwind utilities. Custom CSS goes in `index.css` with clear naming
4. **State Management**: Use React hooks for local state management
5. **Code Organization**: Keep business logic in the service layer, not in components

## Important Notes

- No test framework is currently configured
- ESLint uses flat config with React hooks and refresh plugins
- Lucide React is excluded from Vite optimization
- The app supports dark mode through Tailwind classes and CSS variables