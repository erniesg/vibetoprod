import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
  Handle,
  Position,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getLayoutedElements } from '../utils/autoLayout';
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
} from 'lucide-react';
import { DiagramData } from '../types';

interface DiagramCanvasProps {
  title: string;
  data: DiagramData | null;
  loading: boolean;
  variant: 'cloudflare' | 'competitor';
  isDarkMode: boolean;
  competitorName?: string;
}

// Actor/User Node (Circle)
const ActorNode = ({ data }: { data: { label: string; variant: string; subtitle?: string } }) => {
  const isCloudflare = data.variant === 'cloudflare';
  
  return (
    <div className={`relative w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center shadow-lg ${
      isCloudflare 
        ? 'bg-blue-500 border-blue-400 text-white' 
        : 'bg-gray-500 border-gray-400 text-white'
    }`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      <Handle type="source" position={Position.Left} className="w-3 h-3" />
      
      <Users className="w-6 h-6 mb-1" />
      <div className="text-xs font-semibold text-center leading-tight">{data.label}</div>
      {data.subtitle && <div className="text-xs opacity-80">{data.subtitle}</div>}
    </div>
  );
};

// Process/Service Node (Rectangle)
const ProcessNode = ({ data }: { data: { label: string; type: string; variant: string; subtitle?: string } }) => {
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
    };
    return iconMap[type as keyof typeof iconMap] || Server;
  };

  const Icon = getIcon(data.type);
  const isCloudflare = data.variant === 'cloudflare';

  return (
    <div className={`relative px-4 py-3 border-2 shadow-lg min-w-[140px] ${
      isCloudflare 
        ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-400 text-white' 
        : 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400 text-white'
    }`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="flex flex-col items-center space-y-2">
        <Icon className="w-6 h-6" />
        <div className="text-sm font-semibold text-center leading-tight">{data.label}</div>
        {data.subtitle && <div className="text-xs opacity-90 text-center">{data.subtitle}</div>}
      </div>
    </div>
  );
};

// Database Node (Cylinder shape using CSS)
const DatabaseNode = ({ data }: { data: { label: string; variant: string; subtitle?: string } }) => {
  const isCloudflare = data.variant === 'cloudflare';
  
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
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
          <div className="text-xs font-semibold text-center leading-tight">{data.label}</div>
          {data.subtitle && <div className="text-xs opacity-90 text-center">{data.subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

// Decision Node (Diamond shape)
const DecisionNode = ({ data }: { data: { label: string; variant: string } }) => {
  const isCloudflare = data.variant === 'cloudflare';
  
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className={`w-28 h-28 border-2 transform rotate-45 shadow-lg flex items-center justify-center ${
        isCloudflare 
          ? 'bg-yellow-500 border-yellow-400' 
          : 'bg-gray-500 border-gray-400'
      }`}>
        <div className="text-xs font-semibold text-center text-white transform -rotate-45 max-w-20 leading-tight">
          {data.label}
        </div>
      </div>
    </div>
  );
};

// Storage Node (Hexagon-like shape)
const StorageNode = ({ data }: { data: { label: string; variant: string; subtitle?: string } }) => {
  const isCloudflare = data.variant === 'cloudflare';
  
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className={`relative w-32 h-16 border-2 shadow-lg flex flex-col items-center justify-center ${
        isCloudflare 
          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-400 text-white' 
          : 'bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500 text-white'
      }`} style={{
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
      }}>
        <HardDrive className="w-5 h-5 mb-1" />
        <div className="text-xs font-semibold text-center leading-tight">{data.label}</div>
        {data.subtitle && <div className="text-xs opacity-90 text-center">{data.subtitle}</div>}
      </div>
    </div>
  );
};

const nodeTypes = {
  actor: ActorNode,
  process: ProcessNode,
  database: DatabaseNode,
  decision: DecisionNode,
  storage: StorageNode,
};

const DiagramCanvasContent: React.FC<DiagramCanvasProps> = ({ 
  title, 
  data, 
  loading, 
  variant,
  isDarkMode
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!data) return { initialNodes: [], initialEdges: [] };

    const flowNodes: Node[] = data.shapes.map(shape => {
      let nodeType = 'process'; // default
      
      // Determine node type based on shape type following system design conventions
      if (shape.type === 'users' || shape.type === 'mobile' || shape.type === 'web' || shape.type === 'clients') {
        nodeType = 'actor';
      } else if (shape.type === 'database' || shape.type === 'd1' || shape.type === 'sql' || shape.type === 'rds') {
        nodeType = 'database';
      } else if (shape.type === 'storage' || shape.type === 'r2' || shape.type === 's3' || shape.type === 'kv') {
        nodeType = 'storage';
      } else if (shape.name.toLowerCase().includes('decision') || shape.name.toLowerCase().includes('route') || shape.name.toLowerCase().includes('gateway')) {
        nodeType = 'decision';
      } else {
        nodeType = 'process'; // services, workers, functions, etc.
      }

      return {
        id: shape.id,
        type: nodeType,
        position: shape.position,
        data: {
          label: shape.name,
          type: shape.type,
          variant,
          subtitle: shape.subtitle,
        },
        draggable: false,
      };
    });

    const flowEdges: Edge[] = data.arrows.map(arrow => ({
      id: arrow.id,
      source: arrow.from,
      target: arrow.to,
      label: arrow.label,
      type: 'smoothstep',
      animated: variant === 'cloudflare',
      style: { 
        stroke: variant === 'cloudflare' ? '#f97316' : '#6b7280',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: variant === 'cloudflare' ? '#f97316' : '#6b7280',
        width: 20,
        height: 20,
      },
      labelStyle: {
        fill: isDarkMode ? '#ffffff' : '#000000',
        fontWeight: 600,
        fontSize: 12,
      },
      labelBgStyle: {
        fill: isDarkMode ? '#374151' : '#ffffff',
        fillOpacity: 0.9,
        rx: 4,
        ry: 4,
      },
    }));

    return { initialNodes: flowNodes, initialEdges: flowEdges };
  }, [data, variant, isDarkMode]);

  // Auto-layout effect
  useEffect(() => {
    if (initialNodes.length > 0 && initialEdges.length > 0) {
      // Apply automatic layout using Dagre
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes, 
        initialEdges, 
        'LR' // Left to Right layout
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      // Fit view after layout is applied
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges, fitView]);

  const onConnect = useCallback(() => {}, []);

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${
      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className={`p-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold flex items-center space-x-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <div className={`p-2.5 rounded-xl ${
            variant === 'cloudflare' 
              ? 'bg-gradient-to-r from-orange-500 to-red-500' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          } shadow-md`}>
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span>{title}</span>
        </h3>
      </div>
      
      <div className="relative h-96">
        {loading ? (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              <span className={`text-base font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Generating architecture...
              </span>
            </div>
          </div>
        ) : data ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
            defaultEdgeOptions={{
              type: 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed },
            }}
          >
            <Background 
              color={isDarkMode ? '#374151' : '#e5e7eb'} 
              gap={20}
              size={1}
            />
            <Controls 
              className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
            />
            
          </ReactFlow>
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className="text-center">
              <Cloud className={`w-20 h-20 mx-auto mb-6 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={`text-base font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Architecture diagram will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component with ReactFlowProvider
export const DiagramCanvas: React.FC<DiagramCanvasProps> = (props) => {
  return (
    <DiagramCanvasContent {...props} />
  );
};