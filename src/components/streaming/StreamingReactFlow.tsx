import React, { useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Cloud, 
  Database, 
  Zap, 
  Globe, 
  Server, 
  Shield, 
  Users,
  Smartphone,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Lock,
  BarChart3,
  Webhook,
  GitBranch,
} from 'lucide-react';

interface NodeData {
  id: string;
  type: string;
  name: string;
  subtitle?: string;
  position: { x: number; y: number };
  color: string;
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
  label?: string;
  color: string;
  style: 'solid' | 'dashed';
}

interface StreamingReactFlowProps {
  title: string;
  nodes: NodeData[];
  edges: EdgeData[];
  isStreaming: boolean;
  variant: 'cloudflare' | 'competitor';
  isDarkMode: boolean;
  competitorName?: string;
}

// Actor/User Node (Circle) - matches DiagramCanvas.tsx
const ActorNode = ({ data }: { data: any }) => {
  const isCloudflare = data.variant === 'cloudflare';
  
  return (
    <div className={`relative w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center shadow-lg animate-fade-in-scale ${
      isCloudflare 
        ? 'bg-blue-500 border-blue-400 text-white' 
        : 'bg-gray-500 border-gray-400 text-white'
    }`} data-testid="diagram-node">
      <Users className="w-6 h-6 mb-1" />
      <div className="text-xs font-semibold text-center leading-tight">{data.name}</div>
      {data.subtitle && <div className="text-xs opacity-80">{data.subtitle}</div>}
    </div>
  );
};

// Process/Service Node (Rectangle) - matches DiagramCanvas.tsx  
const ProcessNode = ({ data }: { data: any }) => {
  const getIcon = (type: string) => {
    const iconMap = {
      'cdn': Globe,
      'workers': Zap,
      'pages': Monitor,
      'r2': HardDrive,
      'd1': Database,
      'analytics': BarChart3,
      'security': Shield,
      'kv': Database,
      'durable-objects': Cpu,
      'stream': Smartphone,
      'images': Monitor,
      'turnstile': Lock,
      'webhooks': Webhook,
      'load-balancer': Network,
      'api': Server,
      'cache': Database,
      'storage': HardDrive,
      'compute': Server,
      'function': Zap,
      'service': Server,
      'lambda': Zap,
      'ec2': Server,
      'ecs': Server,
      'cloudfront': Globe,
      'alb': Network,
      'mobile': Smartphone,
      'web': Monitor,
      'clients': Users,
    };
    return iconMap[type as keyof typeof iconMap] || Server;
  };

  const Icon = getIcon(data.type);
  const isCloudflare = data.variant === 'cloudflare';

  return (
    <div className={`relative px-4 py-3 border-2 shadow-lg min-w-[140px] animate-fade-in-scale ${
      isCloudflare 
        ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-400 text-white' 
        : 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400 text-white'
    }`} data-testid="diagram-node">
      <div className="flex flex-col items-center space-y-2">
        <Icon className="w-6 h-6" />
        <div className="text-sm font-semibold text-center leading-tight">{data.name}</div>
        {data.subtitle && <div className="text-xs opacity-90 text-center">{data.subtitle}</div>}
      </div>
    </div>
  );
};

// Database Node (Cylinder shape) - matches DiagramCanvas.tsx
const DatabaseNode = ({ data }: { data: any }) => {
  const isCloudflare = data.variant === 'cloudflare';
  
  return (
    <div className="relative animate-fade-in-scale" data-testid="diagram-node">
      <div className={`relative w-32 h-20 border-2 shadow-lg ${
        isCloudflare 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 text-white' 
          : 'bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500 text-white'
      }`} style={{
        borderRadius: '50px 50px 10px 10px',
      }}>
        {/* Top ellipse */}
        <div className={`absolute -top-2 left-0 right-0 h-4 border-2 ${
          isCloudflare ? 'bg-green-400 border-green-400' : 'bg-gray-500 border-gray-500'
        }`} style={{
          borderRadius: '50px',
        }}></div>
        
        <div className="flex flex-col items-center justify-center h-full pt-2">
          <Database className="w-5 h-5 mb-1" />
          <div className="text-xs font-semibold text-center leading-tight">{data.name}</div>
          {data.subtitle && <div className="text-xs opacity-90 text-center">{data.subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

// Function to determine node type
const getNodeComponent = (nodeType: string) => {
  switch (nodeType) {
    case 'users':
    case 'clients':
    case 'mobile':
    case 'web':
      return ActorNode;
    case 'd1':
    case 'database':
      return DatabaseNode;
    default:
      return ProcessNode;
  }
};

export const StreamingReactFlow: React.FC<StreamingReactFlowProps> = ({
  title,
  nodes: nodeData,
  edges: edgeData,
  isStreaming,
  variant,
  isDarkMode,
  competitorName
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert node data to React Flow format
  const reactFlowNodes = useMemo(() => {
    return nodeData.map((node, index) => {
      const NodeComponent = getNodeComponent(node.type);
      return {
        id: node.id,
        type: node.type, // Use specific type for proper node selection
        position: node.position,
        data: {
          ...node,
          variant: variant, // Add variant for styling
        },
        style: {
          animationDelay: `${index * 200}ms`,
        },
      };
    });
  }, [nodeData, variant]);

  // Convert edge data to React Flow format
  const reactFlowEdges = useMemo(() => {
    return edgeData.map((edge, index) => ({
      id: edge.id,
      source: edge.from,
      target: edge.to,
      label: edge.label,
      type: 'smoothstep',
      animated: variant === 'cloudflare',
      style: {
        stroke: edge.color,
        strokeWidth: 2,
        strokeDasharray: edge.style === 'dashed' ? '5,5' : undefined,
        animationDelay: `${(nodeData.length + index) * 200}ms`,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edge.color,
        width: 20,
        height: 20,
      },
      labelStyle: {
        fontSize: '12px',
        fontWeight: 600,
        color: isDarkMode ? '#ffffff' : '#374151',
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        padding: '2px 6px',
        borderRadius: '4px',
        border: `1px solid ${edge.color}`,
      },
    }));
  }, [edgeData, variant, nodeData.length, isDarkMode]);

  // Update React Flow nodes and edges when data changes
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  useEffect(() => {
    setEdges(reactFlowEdges);
  }, [reactFlowEdges, setEdges]);

  const nodeTypes = useMemo(() => ({
    users: ActorNode,
    clients: ActorNode,
    mobile: ActorNode,
    web: ActorNode,
    'd1': DatabaseNode,
    database: DatabaseNode,
    default: ProcessNode,
    // All other types use ProcessNode
    pages: ProcessNode,
    workers: ProcessNode,
    cdn: ProcessNode,
    r2: ProcessNode,
    kv: ProcessNode,
    'durable-objects': ProcessNode,
    analytics: ProcessNode,
    stream: ProcessNode,
    images: ProcessNode,
    webhooks: ProcessNode,
    service: ProcessNode,
    function: ProcessNode,
  }), []);

  const displayTitle = variant === 'competitor' && competitorName 
    ? `${competitorName} Architecture` 
    : title;

  return (
    <div className={`rounded-xl shadow-lg border overflow-hidden ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {displayTitle}
          </h3>
          {isStreaming && variant === 'cloudflare' && (
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              Streaming...
            </div>
          )}
        </div>
      </div>

      {/* React Flow Container */}
      <div className="h-96 relative">
        {nodeData.length === 0 && !isStreaming ? (
          <div className={`h-full flex items-center justify-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                <Cloud className="w-full h-full" />
              </div>
              <p className="text-sm">
                {variant === 'cloudflare' 
                  ? 'Architecture will appear here...' 
                  : 'Competitor comparison coming soon...'}
              </p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{
              padding: 0.2,
              includeHiddenNodes: false,
            }}
            minZoom={0.5}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            className={isDarkMode ? 'dark' : ''}
          >
            <Background 
              color={isDarkMode ? '#374151' : '#e5e7eb'} 
              gap={20} 
              size={1} 
            />
            <Controls 
              className={isDarkMode ? 'dark' : ''}
              showInteractive={false}
            />
            <Panel position="bottom-right">
              <div className={`text-xs px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {nodes.length} nodes, {edges.length} edges
              </div>
            </Panel>
          </ReactFlow>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.6s ease-out forwards;
          opacity: 0;
          animation-delay: var(--animation-delay, 0ms);
        }
      `}</style>
    </div>
  );
};