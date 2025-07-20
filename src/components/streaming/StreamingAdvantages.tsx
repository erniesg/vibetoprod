import React from 'react';
import { CheckCircle, TrendingUp, Zap, Shield, DollarSign, Clock } from 'lucide-react';

interface StreamingAdvantagesProps {
  advantages: string[];
  valueProps: string[];
  isStreaming: boolean;
  isDarkMode: boolean;
  persona: 'Vibe Coder' | 'FDE' | 'CIO/CTO';
  priorities: string[];
  appDescription: string;
  competitor: string;
}

export const StreamingAdvantages: React.FC<StreamingAdvantagesProps> = ({
  advantages,
  valueProps,
  isStreaming,
  isDarkMode,
  persona,
  priorities,
  appDescription,
  competitor
}) => {
  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'Vibe Coder':
        return 'from-purple-500 to-pink-500';
      case 'FDE':
        return 'from-blue-500 to-cyan-500';
      case 'CIO/CTO':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'performance-critical':
        return Zap;
      case 'cost-conscious':
        return DollarSign;
      case 'security-first':
        return Shield;
      case 'developer-focused':
        return TrendingUp;
      default:
        return CheckCircle;
    }
  };

  const allItems = [
    ...advantages.map(item => ({ type: 'advantage', content: item })),
    ...valueProps.map(item => ({ type: 'value_prop', content: item }))
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Why Cloudflare for {persona}s?
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
          {isStreaming 
            ? 'Discovering contextual advantages as your architecture evolves...'
            : `Based on your ${appDescription ? 'application requirements' : 'input'}, here's why Cloudflare outperforms ${competitor}`
          }
        </p>
      </div>

      {/* Streaming Progress */}
      {isStreaming && allItems.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-700 font-medium">
              Analyzing your requirements to generate contextual advantages...
            </span>
          </div>
        </div>
      )}

      {/* Advantages Grid */}
      {allItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allItems.map((item, index) => {
            const isAdvantage = item.type === 'advantage';
            const Icon = isAdvantage ? CheckCircle : DollarSign;
            const bgColor = isAdvantage 
              ? (isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200')
              : (isDarkMode ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200');
            const textColor = isAdvantage
              ? (isDarkMode ? 'text-green-400' : 'text-green-700')
              : (isDarkMode ? 'text-orange-400' : 'text-orange-700');
            const iconColor = isAdvantage ? 'text-green-600' : 'text-orange-600';

            return (
              <div
                key={index}
                className={`
                  p-6 rounded-xl border transition-all duration-500 ease-out
                  transform animate-slide-in
                  ${bgColor}
                `}
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${isAdvantage ? 'bg-green-100' : 'bg-orange-100'}`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-2 ${textColor}`}>
                      {isAdvantage ? 'Technical Advantage' : 'Business Value'}
                    </h4>
                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Priorities Callout */}
      {priorities.length > 0 && allItems.length > 0 && (
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Addressing Your Priorities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorities.slice(0, 3).map((priority, index) => {
              const PriorityIcon = getPriorityIcon(priority);
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getPersonaColor(persona)}`}>
                    <PriorityIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {priority.replace('-', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Persona-Specific Summary */}
      {allItems.length > 0 && !isStreaming && (
        <div className={`text-center p-8 rounded-xl ${
          isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-gray-50 to-gray-100'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {persona === 'Vibe Coder' && 'From Vibe to Prod in Minutes'}
            {persona === 'FDE' && 'Frontend-First, Full-Stack Ready'} 
            {persona === 'CIO/CTO' && 'Enterprise-Grade, Startup Speed'}
          </h3>
          <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {persona === 'Vibe Coder' && 'Skip the infrastructure complexity. Deploy your ideas globally with a single git push, then iterate at the speed of thought.'}
            {persona === 'FDE' && 'Build rich frontend experiences without backend complexity. Cloudflare handles the infrastructure so you can focus on user experience.'} 
            {persona === 'CIO/CTO' && 'Get enterprise-grade reliability and security with startup agility. Predictable costs, global performance, zero vendor lock-in.'}
          </p>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
          animation-delay: var(--animation-delay, 0ms);
        }
      `}</style>
    </div>
  );
};