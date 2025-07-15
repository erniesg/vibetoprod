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
        logo: company.logo
      }))
    }
  ];

  const theme = {
    axis: {
      ticks: {
        text: {
          fill: isDarkMode ? '#e5e7eb' : '#374151',
          fontSize: 12
        }
      },
      legend: {
        text: {
          fill: isDarkMode ? '#e5e7eb' : '#374151',
          fontSize: 14,
          fontWeight: 600
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
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
    
    return (
      <g transform={`translate(${node.x},${node.y})`}>
        {/* Circle background */}
        <circle
          r={size}
          fill={isCloudflare ? '#f97316' : style.color}
          fillOpacity={isCloudflare ? 0.8 : 0.6}
          stroke={isCloudflare ? '#ea580c' : style.color}
          strokeWidth={isCloudflare ? 3 : 1}
        />
        
        {/* Company name */}
        <text
          textAnchor="middle"
          y={-size - 10}
          style={{
            fontSize: isCloudflare ? '14px' : '12px',
            fontWeight: isCloudflare ? 'bold' : 'normal',
            fill: isDarkMode ? '#e5e7eb' : '#374151',
          }}
        >
          {node.data.company}
        </text>
        
        {/* Valuation */}
        <text
          textAnchor="middle"
          y={5}
          style={{
            fontSize: '11px',
            fill: isCloudflare ? '#ffffff' : (isDarkMode ? '#d1d5db' : '#6b7280'),
            fontWeight: isCloudflare ? 'bold' : 'normal',
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
          Bubble size represents company valuation/market cap
        </p>
      </div>
      
      <ResponsiveScatterPlot
        data={chartData}
        theme={theme}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: 'linear', min: 0, max: 10 }}
        yScale={{ type: 'linear', min: 0, max: 10 }}
        xFormat=">-.1f"
        yFormat=">-.1f"
        blendMode="normal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Developer Experience →',
          legendPosition: 'middle',
          legendOffset: 46
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Operational Efficiency →',
          legendPosition: 'middle',
          legendOffset: -60
        }}
        nodeSize={getNodeSize}
        nodeComponent={NodeComponent}
        colors={{ scheme: 'category10' }}
        useMesh={false}
        tooltip={({ node }) => (
          <div className={`p-3 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="font-bold">{node.data.company}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Valuation: ${node.data.valuation}B
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              DX: {node.data.x} | OpEx: {node.data.y}
            </div>
          </div>
        )}
      />
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Cloudflare (Convergent Leader)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full opacity-60"></div>
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Other Platforms
          </span>
        </div>
      </div>
    </div>
  );
};