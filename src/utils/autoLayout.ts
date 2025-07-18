import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

const nodeWidth = 172;
const nodeHeight = 50;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  if (nodes.length === 0) return { nodes: [], edges };
  
  console.log(`📐 Auto-layout: ${nodes.length} nodes, ${edges.length} edges`);
  const isHorizontal = direction === 'LR';
  
  // Create fresh graph for each layout (no shared state)
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

// Calculate dynamic node width based on content
function getNodeWidth(node: Node): number {
  const baseWidth = 140;
  const label = node.data?.label || node.data?.name || '';
  const charWidth = 8; // Approximate character width
  const calculatedWidth = Math.max(baseWidth, label.length * charWidth + 40);
  
  // Cap maximum width to prevent overly wide nodes
  return Math.min(calculatedWidth, 250);
}

// Calculate dynamic node height based on type and content
function getNodeHeight(node: Node): number {
  const baseHeight = 50;
  
  // Different heights for different node types
  switch (node.type) {
    case 'users':
      return 60;
    case 'service':
      return baseHeight;
    case 'database':
      return 55;
    default:
      return baseHeight;
  }
}

// Utility to apply auto-layout to streaming data
export const applyAutoLayoutToStreamingData = async (
  cloudflareNodes: Node[],
  cloudflareEdges: Edge[],
  competitorNodes: Node[],
  competitorEdges: Edge[]
) => {
  // Layout both architectures separately to maintain clean separation
  const [cloudflareLayout, competitorLayout] = await Promise.all([
    getLayoutedElements(cloudflareNodes, cloudflareEdges, { 
      direction: 'RIGHT',
      nodeSpacing: 80,
      layerSpacing: 120 
    }),
    getLayoutedElements(competitorNodes, competitorEdges, { 
      direction: 'RIGHT',
      nodeSpacing: 80,
      layerSpacing: 120 
    })
  ]);

  // Offset competitor layout to appear below Cloudflare
  const yOffset = 300;
  const offsetCompetitorNodes = competitorLayout.nodes.map(node => ({
    ...node,
    position: {
      x: node.position.x,
      y: node.position.y + yOffset
    }
  }));

  return {
    cloudflareNodes: cloudflareLayout.nodes,
    cloudflareEdges: cloudflareLayout.edges,
    competitorNodes: offsetCompetitorNodes,
    competitorEdges: competitorLayout.edges,
  };
};