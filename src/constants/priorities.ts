export const PRIORITY_MAPPINGS = {
  'Cost Optimization': {
    emoji: '💰',
    title: 'Cost Optimization',
    description: 'Reduce cloud spend by half'
  },
  'Speed to Market': {
    emoji: '🚀',
    title: 'Speed to Market',
    description: 'Deploy faster with zero DevOps'
  },
  'Enterprise Security': {
    emoji: '🔒',
    title: 'Enterprise Security',
    description: 'Built-in DDoS protection and WAF'
  },
  'Global Performance': {
    emoji: '🌍',
    title: 'Global Performance',
    description: 'Reach worldwide users in <50ms'
  }
} as const;

export type PriorityKey = keyof typeof PRIORITY_MAPPINGS;