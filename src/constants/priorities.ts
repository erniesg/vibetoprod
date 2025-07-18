export const PRIORITY_MAPPINGS = {
  'Cost-Conscious': {
    emoji: '💰',
    title: 'Cost Optimization',
    description: 'Reduce cloud spend by half'
  },
  'Developer-Focused': {
    emoji: '🚀',
    title: 'Speed to Market',
    description: 'Deploy faster with zero DevOps'
  },
  'Security-First': {
    emoji: '🔒',
    title: 'Enterprise Security',
    description: 'Built-in DDoS protection and WAF'
  },
  'Performance-Critical': {
    emoji: '🌍',
    title: 'Global Performance',
    description: 'Reach worldwide users in <50ms'
  }
} as const;

export type PriorityKey = keyof typeof PRIORITY_MAPPINGS;