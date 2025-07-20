export interface UserInput {
  persona: 'Vibe Coder' | 'AIE/FDE' | 'CIO/CTO';
  region: string;
  appDescription: string;
  competitors: ('AWS' | 'GCP' | 'Azure' | 'Alibaba')[];
  scale: 'Startup' | 'Growth' | 'Enterprise' | 'Global';
  priorities: string[];
  maxPriorities: number;
}

export interface ArchitectureResponse {
  cloudflare: DiagramData;
  competitor: DiagramData;
  advantages: string[];
}

export interface DiagramData {
  shapes: DiagramShape[];
  arrows: DiagramArrow[];
  labels: DiagramLabel[];
}

export interface DiagramShape {
  id: string;
  type: 'service' | 'database' | 'cdn' | 'function';
  name: string;
  subtitle?: string;
  position: { x: number; y: number };
  color: string;
  icon?: string;
}

export interface DiagramArrow {
  id: string;
  from: string;
  to: string;
  label?: string;
  color: string;
  style: 'solid' | 'dashed';
}

export interface DiagramLabel {
  id: string;
  text: string;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  color: string;
}