import React from 'react';
import { CheckCircle, ArrowRight, DollarSign, Shield, Globe, Users, TrendingUp } from 'lucide-react';

// Helper function to render text with bold formatting and scribble effect
const renderTextWithBold = (text: string, isDarkMode: boolean) => {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className={isDarkMode ? 'text-orange-400' : 'text-orange-600'}>
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

interface AdvantagesPanelProps {
  advantages: string[];
  loading: boolean;
  persona: 'Vibe Coder' | 'FDE' | 'CIO/CTO';
  isDarkMode: boolean;
  constraints: string[];
  appDescription: string;
  competitor: string;
  streamingMode?: boolean;
  constraintValueProps?: Array<{
    emoji: string;
    title: string;
    description: string;
  }>;
}

// Constraint icon mapping (consistent with ConstraintsSelector)
const constraintIcons = {
  'Cost Optimization': { icon: DollarSign, emoji: '💰' },
  'Global Performance': { icon: Globe, emoji: '🌍' },
  'Enterprise Security': { icon: Shield, emoji: '🔒' },
  'Developer Velocity': { icon: Users, emoji: '👨‍💻' },
  'Scalability': { icon: TrendingUp, emoji: '📈' }
};

// Convert icon name strings to actual icon components for streaming mode
const getIconByName = (iconName: string) => {
  const iconMap = {
    'DollarSign': DollarSign,
    'Shield': Shield, 
    'Globe': Globe,
    'Users': Users,
    'TrendingUp': TrendingUp,
    'CheckCircle': CheckCircle
  };
  return iconMap[iconName as keyof typeof iconMap] || CheckCircle;
};

export const AdvantagesPanel: React.FC<AdvantagesPanelProps> = ({ 
  loading, 
  isDarkMode, 
  constraints,
  appDescription,
  competitor,
  streamingMode = false,
  constraintValueProps = []
}) => {
  
  // Generate dynamic value propositions based on constraints
  const generateConstraintValueProps = () => {
    const appType = detectAppType(appDescription);
    
    return constraints.map((constraint) => {
      const iconData = constraintIcons[constraint as keyof typeof constraintIcons];
      const Icon = iconData?.icon || CheckCircle;
      
      switch (constraint) {
        case 'Cost Optimization':
          return {
            icon: Icon,
            emoji: '💰',
            title: 'Dramatic Cost Reduction',
            description: `Cost advantage: Cloudflare's $0 egress fees vs ${competitor}'s $0.09/GB means ${
              appType === 'gaming' ? 'your multiplayer game saves $90,000 per TB of player data' :
              appType === 'social' ? 'your social platform saves thousands on video streaming costs' :
              appType === 'ecommerce' ? 'your e-commerce site eliminates data transfer fees entirely' :
              'your application cuts infrastructure costs by 60-80%'
            }, plus no idle server costs with true pay-per-use pricing.`
          };
          
        case 'Developer Velocity':
          return {
            icon: Icon,
            emoji: '👨‍💻',
            title: 'Code, Not Config',
            description: `Developer experience: Cloudflare's integrated platform vs ${competitor}'s service juggling means ${
              appType === 'gaming' ? 'you can push game updates and hotfixes instantly to all players worldwide' :
              appType === 'social' ? 'you build features, not deployment pipelines' :
              appType === 'api' ? 'you write business logic, not scaling configurations' :
              'your developers spend 80% more time building features'
            }, with TypeScript everywhere and zero DevOps overhead.`
          };
          
        case 'Global Performance':
          return {
            icon: Icon,
            emoji: '🌍',
            title: 'Sub-50ms Globally',
            description: `Performance advantage: Cloudflare's <50ms global latency vs ${competitor}'s 200ms+ regional delays means ${
              appType === 'gaming' ? 'players in Singapore, São Paulo, and Stockholm all get identical ultra-low latency' :
              appType === 'social' ? 'users see real-time updates instantly, boosting engagement by 40%' :
              appType === 'ecommerce' ? 'customers worldwide experience local-speed shopping, increasing conversions' :
              'users experience consistently fast performance regardless of location'
            }, with 300+ edge locations vs their handful of regions.`
          };
          
        case 'Enterprise Security':
          return {
            icon: Icon,
            emoji: '🔒',
            title: 'Security by Default',
            description: `Security advantage: Cloudflare's built-in DDoS protection and WAF vs ${competitor}'s additional security services means ${
              appType === 'gaming' ? 'your game servers are protected from attacks without performance impact' :
              appType === 'ecommerce' ? 'customer data and transactions are secured by default with PCI compliance' :
              appType === 'api' ? 'your APIs are protected from abuse and attacks automatically' :
              'your application gets enterprise-grade security'
            }, with zero additional configuration or licensing costs.`
          };
          
        case 'Scalability':
          return {
            icon: Icon,
            emoji: '📈',
            title: 'Auto-Scale to Infinity',
            description: `Scaling advantage: Cloudflare's automatic scaling vs ${competitor}'s manual configuration means ${
              appType === 'gaming' ? 'your game handles viral growth from 100 to 100,000 players seamlessly' :
              appType === 'social' ? 'your platform scales from startup to unicorn without infrastructure rewrites' :
              appType === 'ecommerce' ? 'your store handles Black Friday traffic spikes without crashes' :
              'your application scales effortlessly from 1 user to 1 billion users'
            }, with zero capacity planning or server provisioning required.`
          };
          
        default:
          return {
            icon: Icon,
            emoji: '✨',
            title: 'Cloudflare Advantage',
            description: 'Cloudflare delivers superior performance and developer experience compared to traditional cloud providers.'
          };
      }
    });
  };

  const detectAppType = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes('game') || desc.includes('multiplayer')) return 'gaming';
    if (desc.includes('social') || desc.includes('chat') || desc.includes('feed')) return 'social';
    if (desc.includes('e-commerce') || desc.includes('shop') || desc.includes('store')) return 'ecommerce';
    if (desc.includes('api') || desc.includes('backend')) return 'api';
    if (desc.includes('real-time') || desc.includes('collaborative')) return 'realtime';
    if (desc.includes('analytics') || desc.includes('dashboard')) return 'analytics';
    
    return 'webapp';
  };

  // In streaming mode, use the props passed in; otherwise generate them
  const generatedValueProps = streamingMode ? constraintValueProps : generateConstraintValueProps();
  
  // In streaming mode, always show constraintValueProps (auto-selected or user-selected)
  // In non-streaming mode, only show if user has selected constraints
  const displayAdvantages = streamingMode 
    ? constraintValueProps 
    : (constraints.length > 0 ? generatedValueProps : []);

  // Show loading state during streaming when we should have constraint value props but don't yet
  const shouldShowLoading = streamingMode && constraintValueProps.length === 0;
  const hasValidData = displayAdvantages.length > 0;

  // Debug logging
  if (streamingMode) {
    console.log('🔍 AdvantagesPanel Debug:', {
      constraints: constraints.length,
      constraintValueProps: constraintValueProps.length,
      displayAdvantages: displayAdvantages.length,
      shouldShowLoading,
      hasValidData,
      streamingMode,
      loading
    });
    
    if (constraintValueProps.length > 0) {
      console.log('🎯 AdvantagesPanel received constraintValueProps:', constraintValueProps);
    }
    
    if (displayAdvantages.length > 0) {
      console.log('🎯 AdvantagesPanel displayAdvantages:', displayAdvantages);
    }
  }

  const getAdvantageColors = (index: number) => {
    const colorSets = [
      { 
        bg: isDarkMode ? 'bg-gray-800 border-purple-800' : 'bg-white border-purple-200', 
        iconBg: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100',
        text: isDarkMode ? 'text-purple-400' : 'text-purple-600', 
        border: isDarkMode ? 'border-purple-800' : 'border-purple-200' 
      },
      { 
        bg: isDarkMode ? 'bg-gray-800 border-blue-800' : 'bg-white border-blue-200',
        iconBg: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100', 
        text: isDarkMode ? 'text-blue-400' : 'text-blue-600', 
        border: isDarkMode ? 'border-blue-800' : 'border-blue-200' 
      },
      { 
        bg: isDarkMode ? 'bg-gray-800 border-green-800' : 'bg-white border-green-200',
        iconBg: isDarkMode ? 'bg-green-900/20' : 'bg-green-100', 
        text: isDarkMode ? 'text-green-400' : 'text-green-600', 
        border: isDarkMode ? 'border-green-800' : 'border-green-200' 
      },
      { 
        bg: isDarkMode ? 'bg-gray-800 border-orange-800' : 'bg-white border-orange-200',
        iconBg: isDarkMode ? 'bg-orange-900/20' : 'bg-orange-100', 
        text: isDarkMode ? 'text-orange-400' : 'text-orange-600', 
        border: isDarkMode ? 'border-orange-800' : 'border-orange-200' 
      },
      { 
        bg: isDarkMode ? 'bg-gray-800 border-red-800' : 'bg-white border-red-200',
        iconBg: isDarkMode ? 'bg-red-900/20' : 'bg-red-100', 
        text: isDarkMode ? 'text-red-400' : 'text-red-600', 
        border: isDarkMode ? 'border-red-800' : 'border-red-200' 
      }
    ];
    return colorSets[index % colorSets.length];
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${
      isDarkMode ? 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-800/50' : 'bg-gradient-to-br from-orange-50 to-red-50'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Why Cloudflare?</h3>
          </div>
          <div className="flex items-center space-x-2 text-white text-sm font-medium opacity-90">
            <span>Cloudflare vs {competitor}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {(loading || shouldShowLoading) ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4 p-4">
                <div className={`w-14 h-14 rounded-xl animate-pulse ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className="flex-1 space-y-3">
                  <div className={`h-5 rounded animate-pulse ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-4 rounded animate-pulse w-4/5 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-4 rounded animate-pulse w-3/5 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : hasValidData ? (
          <div className="space-y-6">
            {displayAdvantages.map((advantage, index) => {
              const colors = getAdvantageColors(index);
              // Only use emoji in streaming mode, no redundant icon
              
              return (
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 p-5 rounded-xl border transition-all shadow-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-200'
                  } ${streamingMode ? 'animate-slide-in' : ''}`}
                  style={streamingMode ? { animationDelay: `${index * 200}ms` } : {}}>
                  <div className={`p-4 rounded-xl ${colors.iconBg} flex-shrink-0 flex items-center justify-center`}>
                    <span className="text-3xl">{advantage.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {advantage.title}
                    </h4>
                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {renderTextWithBold(advantage.description, isDarkMode)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDarkMode ? 'bg-orange-900/20' : 'bg-orange-100'
            }`}>
              <CheckCircle className={`w-8 h-8 ${
                isDarkMode ? 'text-orange-400' : 'text-orange-500'
              }`} />
            </div>
            <p className={`text-base ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Select priorities to see targeted value propositions
            </p>
          </div>
        )}
      </div>
      
      {/* Custom CSS for streaming animations */}
      {streamingMode && (
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
          }
        `}</style>
      )}
    </div>
  );
};