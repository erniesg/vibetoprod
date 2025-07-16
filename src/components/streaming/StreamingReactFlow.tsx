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

// Custom node component with animations
const CustomNode = ({ data, selected }: any) => {
  const iconMap: Record<string, any> = {
    users: Users,
    mobile: Smartphone,
    web: Monitor,
    pages: Globe,
    workers: Cpu,
    'd1': Database,
    'kv': HardDrive,
    'r2': HardDrive,
    'durable-objects': Network,
    analytics: BarChart3,
    stream: Zap,
    images: GitBranch,
    webhooks: Webhook,
    clients: Users,
    cdn: Cloud,
    service: Server,
    database: Database,
    function: Zap,
  };

  const IconComponent = iconMap[data.type] || Server;

  return (
    <div
      className={`
        px-4 py-3 shadow-lg rounded-xl border-2 transition-all duration-500 ease-out
        transform hover:scale-105 cursor-pointer
        animate-fade-in-scale
        ${selected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}
      style={{
        backgroundColor: data.color + '20',
        borderColor: data.color,
        minWidth: '120px',
      }}
      data-testid="diagram-node"
    >
      <div className="flex items-center space-x-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: data.color }}
        >
          <IconComponent className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 truncate">
            {data.name}
          </div>
          {data.subtitle && (
            <div className="text-xs text-gray-600 truncate">
              {data.subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
    return nodeData.map((node, index) => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: node,
      style: {
        animationDelay: `${index * 200}ms`,
      },
    }));
  }, [nodeData]);

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
    custom: CustomNode,
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