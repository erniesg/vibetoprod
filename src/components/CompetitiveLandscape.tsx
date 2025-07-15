import React from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { companyData } from '../data/companyData';

interface CompetitiveLandscapeProps {
  isDarkMode?: boolean;
}

export const CompetitiveLandscape: React.FC<CompetitiveLandscapeProps> = ({
  isDarkMode = false
}) => {
  // Transform company data for Nivo
  const chartData = [
    {
      id: 'companies',
      data: companyData.map(company => ({
        x: company.x,
        y: company.y,
        company: company.name,
        valuation: company.valuation,
        logo: company.logo,
        source: company.source,
        sourceLabel: company.sourceLabel
      }))
    }
  ];

  const theme = {
    axis: {
      ticks: {
        text: {
          fill: isDarkMode ? '#e5e7eb' : '#374151',
          fontSize: 12
        },
        line: {
          stroke: isDarkMode ? '#4b5563' : '#9ca3af',
          strokeWidth: 1
        }
      },
      legend: {
        text: {
          fill: isDarkMode ? '#e5e7eb' : '#374151',
          fontSize: 14,
          fontWeight: 600
        }
      },
      domain: {
        line: {
          stroke: isDarkMode ? '#4b5563' : '#9ca3af',
          strokeWidth: 1
        }
      }
    },
    grid: {
      line: {
        stroke: isDarkMode ? '#374151' : '#e5e7eb',
        strokeDasharray: '2 2'
      }
    },
    tooltip: {
      container: {
        background: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#e5e7eb' : '#111827',
        fontSize: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb'
      }
    }
  };

  const getNodeSize = (node: any) => {
    const valuation = node.data.valuation;
    // Scale the size based on valuation (log scale for better visibility)
    const baseSize = 400;
    const scaleFactor = Math.log10(valuation + 1) * 150;
    return baseSize + scaleFactor;
  };

  const NodeComponent = ({ node, style }: any) => {
    const size = Math.sqrt(getNodeSize(node) / Math.PI) * 2;
    
    // Determine if this is Cloudflare
    const isCloudflare = node.data.company === 'Cloudflare';
    
    // Define consistent color palette for both light and dark modes
    const getNodeColors = () => {
      if (isCloudflare) {
        return {
          fill: '#f97316', // Orange-500
          stroke: '#ea580c', // Orange-600
          textOnNode: '#ffffff',
          textAboveNode: isDarkMode ? '#ffffff' : '#1f2937'
        };
      } else {
        // Use consistent colors for other nodes
        const nodeColors = [
          '#3b82f6', // Blue-500
          '#10b981', // Emerald-500
          '#8b5cf6', // Violet-500
          '#f59e0b', // Amber-500
          '#ef4444', // Red-500
          '#06b6d4', // Cyan-500
          '#84cc16', // Lime-500
          '#f97316', // Orange-500
          '#6366f1', // Indigo-500
          '#ec4899', // Pink-500
        ];
        
        // Get a consistent color based on company name
        const colorIndex = node.data.company.length % nodeColors.length;
        const baseColor = nodeColors[colorIndex];
        
        return {
          fill: baseColor,
          stroke: baseColor,
          textOnNode: '#ffffff',
          textAboveNode: isDarkMode ? '#e5e7eb' : '#374151'
        };
      }
    };
    
    const colors = getNodeColors();
    
    // Calculate text position to avoid overlap
    const textOffset = size + 15;
    const isTopHalf = node.data.y > 5; // If in top half of chart
    const textY = isTopHalf ? -textOffset : textOffset;
    
    return (
      <g transform={`translate(${node.x},${node.y})`}>
        {/* Circle background */}
        <circle
          r={size}
          fill={colors.fill}
          fillOpacity={0.8}
          stroke={colors.stroke}
          strokeWidth={isCloudflare ? 3 : 2}
        />
        
        {/* Company name (positioned to avoid overlap) */}
        <text
          textAnchor="middle"
          y={textY}
          style={{
            fontSize: isCloudflare ? '14px' : '12px',
            fontWeight: isCloudflare ? 'bold' : '600',
            fill: colors.textAboveNode,
          }}
        >
          {node.data.company}
        </text>
        
        {/* Valuation (inside the circle) */}
        <text
          textAnchor="middle"
          y={5}
          style={{
            fontSize: '11px',
            fill: colors.textOnNode,
            fontWeight: '600',
          }}
        >
          ${node.data.valuation}B
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-[600px]">
      <div className="mb-4 text-center">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          The Modern Application Platform Landscape
        </h3>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Bubble size represents company valuation/market cap • Hover for details and data sources
        </p>
      </div>
      
      <ResponsiveScatterPlot
        data={chartData}
        theme={theme}
        margin={{ top: 60, right: 140, bottom: 80, left: 120 }}
        xScale={{ type: 'linear', min: 0, max: 10 }}
        yScale={{ type: 'linear', min: 0, max: 10 }}
        xFormat=">-.0f"
        yFormat=">-.0f"
        blendMode="normal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Developer Experience & Velocity →',
          legendPosition: 'middle',
          legendOffset: 50
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Operational & Strategic Efficiency →',
          legendPosition: 'middle',
          legendOffset: -80
        }}
        nodeSize={getNodeSize}
        nodeComponent={NodeComponent}
        colors={{ scheme: 'category10' }}
        useMesh={false}
        layers={[
          'grid',
          'axes',
          // Custom layer for quadrant lines
          ({ xScale, yScale, innerWidth, innerHeight }) => (
            <g>
              {/* Vertical line at x=5 */}
              <line
                x1={xScale(5)}
                y1={0}
                x2={xScale(5)}
                y2={innerHeight}
                stroke={isDarkMode ? '#4b5563' : '#9ca3af'}
                strokeWidth={2}
                strokeDasharray="5,5"
              />
              {/* Horizontal line at y=5 */}
              <line
                x1={0}
                y1={yScale(5)}
                x2={innerWidth}
                y2={yScale(5)}
                stroke={isDarkMode ? '#4b5563' : '#9ca3af'}
                strokeWidth={2}
                strokeDasharray="5,5"
              />
              
              {/* Quadrant Labels */}
              <text
                x={xScale(2.5)}
                y={yScale(7.5)}
                textAnchor="middle"
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fill: isDarkMode ? '#9ca3af' : '#6b7280',
                  opacity: 0.8
                }}
              >
                AI Disruptors
              </text>
              <text
                x={xScale(7.5)}
                y={yScale(7.5)}
                textAnchor="middle"
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fill: isDarkMode ? '#9ca3af' : '#6b7280',
                  opacity: 0.8
                }}
              >
                Velocity Kings
              </text>
              <text
                x={xScale(2.5)}
                y={yScale(2.5)}
                textAnchor="middle"
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fill: isDarkMode ? '#9ca3af' : '#6b7280',
                  opacity: 0.8
                }}
              >
                Incumbent Powerhouses
              </text>
              <text
                x={xScale(7.5)}
                y={yScale(2.5)}
                textAnchor="middle"
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fill: isDarkMode ? '#f97316' : '#ea580c',
                  opacity: 0.9
                }}
              >
                Convergent Leader
              </text>
            </g>
          ),
          'nodes',
          'mesh'
        ]}
        tooltip={({ node }) => (
          <div className={`p-4 rounded-lg shadow-lg border max-w-xs ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-900 border-gray-200'
          }`}>
            <div className="font-bold text-base mb-2">{node.data.company}</div>
            <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="font-semibold">Valuation:</span> ${node.data.valuation}B
            </div>
            <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="font-semibold">Position:</span> DX: {node.data.x} | OpEx: {node.data.y}
            </div>
            <div className={`text-xs border-t pt-2 mt-2 ${
              isDarkMode ? 'text-gray-400 border-gray-600' : 'text-gray-500 border-gray-200'
            }`}>
              <div className="font-semibold mb-1">Data Source:</div>
              <div>{node.data.sourceLabel}</div>
            </div>
          </div>
        )}
      />
      
      {/* Legend and Quadrant Guide */}
      <div className="mt-6 space-y-4">
        {/* Platform Types */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-orange-600"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Cloudflare (Convergent Leader)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-500 opacity-80"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Hyperscalers (AWS, GCP, Azure)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-emerald-500 opacity-80"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Specialist PaaS (Vercel, Netlify)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-violet-500 rounded-full border-2 border-violet-500 opacity-80"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              AI-First Platforms
            </span>
          </div>
        </div>
        
        {/* Quadrant Guide */}
        <div className={`text-center text-xs mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="font-semibold mb-2">Quadrant Analysis</div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 max-w-2xl mx-auto">
            <div>
              <span className="font-medium">Top-Left:</span> Velocity Kings (High DX, Lower OpEx)
            </div>
            <div>
              <span className="font-medium text-orange-500">Top-Right:</span> Convergent Leader (High DX, High OpEx)
            </div>
            <div>
              <span className="font-medium">Bottom-Left:</span> AI Disruptors (Lower DX, Lower OpEx)
            </div>
            <div>
              <span className="font-medium">Bottom-Right:</span> Incumbent Powerhouses (Lower DX, High OpEx)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};