import { z } from 'zod';

// Core building blocks
export const diagramNodeSchema = z.object({
  id: z.string().describe('Unique identifier for the node'),
  type: z.enum([
    'service', 'database', 'cdn', 'function', 'workers', 'pages', 
    'r2', 'd1', 'analytics', 'security', 'kv', 'users', 'lambda',
    'ec2', 'ecs', 'cloudfront', 'alb', 'api', 'cache', 'storage'
  ]).describe('Service type for icon selection'),
  name: z.string().describe('Display name of the service'),
  subtitle: z.string().optional().describe('Additional service description'),
  position: z.object({
    x: z.number().default(0).describe('X coordinate (auto-layout will override)'),
    y: z.number().default(0).describe('Y coordinate (auto-layout will override)')
  }).optional().default({ x: 0, y: 0 }),
  color: z.string().describe('Hex color code like #f97316')
});

export const diagramEdgeSchema = z.object({
  id: z.string().describe('Unique identifier for the edge'),
  from: z.string().describe('Source node ID'),
  to: z.string().describe('Target node ID'),
  label: z.string().describe('Connection description'),
  color: z.string().describe('Hex color code'),
  style: z.enum(['solid', 'dashed']).describe('Line style')
});

export const priorityValuePropSchema = z.object({
  emoji: z.string().describe('Display emoji'),
  title: z.string().describe('Short compelling title'),
  description: z.string().describe('1-2 sentence comparison with specific metrics')
});

// Main architecture response schema
export const architectureResponseSchema = z.object({
  cloudflare: z.object({
    nodes: z.array(diagramNodeSchema).describe('Cloudflare services and components'),
    edges: z.array(diagramEdgeSchema).describe('Connections between Cloudflare services')
  }),
  competitor: z.object({
    nodes: z.array(diagramNodeSchema).describe('Competitor services and components'),
    edges: z.array(diagramEdgeSchema).describe('Connections between competitor services')
  }),
  priorityValueProps: z.array(priorityValuePropSchema)
    .describe('Priority-specific value propositions with metrics')
});

// Streaming element schema for progressive generation
export const streamingElementSchema = z.union([
  z.object({
    type: z.literal('node'),
    platform: z.enum(['cloudflare', 'competitor']),
    data: diagramNodeSchema
  }),
  z.object({
    type: z.literal('edge'),
    platform: z.enum(['cloudflare', 'competitor']),
    data: diagramEdgeSchema
  }),
  z.object({
    type: z.literal('priority_value_prop'),
    platform: z.literal('cloudflare'),
    data: priorityValuePropSchema
  })
]);

// TypeScript types
export type DiagramNode = z.infer<typeof diagramNodeSchema>;
export type DiagramEdge = z.infer<typeof diagramEdgeSchema>;
export type PriorityValueProp = z.infer<typeof priorityValuePropSchema>;
export type ArchitectureResponse = z.infer<typeof architectureResponseSchema>;
export type StreamingElement = z.infer<typeof streamingElementSchema>;