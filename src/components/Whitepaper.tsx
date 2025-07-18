import React from 'react';
import { Zap, Globe, Shield, Users, Building, CheckCircle, ArrowRight, Sparkles, Database, Server, DollarSign } from 'lucide-react';
import { CompetitiveLandscape } from './CompetitiveLandscape';

interface WhitepaperProps {
  isDarkMode: boolean;
}

export const Whitepaper: React.FC<WhitepaperProps> = ({ isDarkMode }) => {
  return (
    <>
      {/* Opportunity Section */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-16 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Opportunity: Build for the AI-Native World
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              AI applications are not traditional web apps; they are stateful conversations. 
              A compute model built for stateless request-response cycles is fundamentally mismatched.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Stateful Serverless
                </h3>
              </div>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Traditional serverless is amnesiac. For an AI to remember, it faces high-latency lookups to a central database. 
                <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}> Durable Objects</strong> fuse compute and state at the edge, making AI feel instantaneous.
              </p>
            </div>

            <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI-Native at the Edge
                </h3>
              </div>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Running your AI model at the edge is only half the battle. We bring the data to the compute with 
                <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}> Vectorize, D1, and R2</strong> all co-located with Workers.
              </p>
            </div>

            <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  From Zero-to-Global
                </h3>
              </div>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                The old way is shipping to a region. The Cloudflare way is shipping to the world. 
                <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}> 300+ cities</strong> mean your AI feels local everywhere.
              </p>
            </div>

            <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Zero Egress, Zero Surprises
                </h3>
              </div>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Traditional clouds charge for every byte that leaves their network. 
                <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}> Cloudflare charges $0 for egress</strong>. Scale without financial fear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning Section */}
      <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} py-16 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Positioning: Where Cloudflare Wins
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              In the race to capture developer mindshare, Cloudflare's unique architecture creates defensible advantages
            </p>
          </div>

          <CompetitiveLandscape isDarkMode={isDarkMode} />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Shield className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Built-in Security
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                DDoS protection, WAF, and bot management included at no extra cost
              </p>
            </div>

            <div className={`text-center p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Globe className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                True Edge Computing
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                300+ cities, not just "regions" - compute where your users are
              </p>
            </div>

            <div className={`text-center p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Zap className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Instant Global Deployment
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Deploy worldwide in seconds, not hours across availability zones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Section */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-16 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Market: The APAC Opportunity
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              APAC represents the future of cloud computing, with unique challenges that favor Cloudflare's architecture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`}>
                4.3B
              </div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Internet users in APAC
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                60% of global internet population
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                50ms
              </div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Latency advantage
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                vs traditional cloud providers
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>
                $547B
              </div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cloud market by 2030
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Growing at 16.3% CAGR
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>
                23
              </div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Countries covered
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                With diverse regulations
              </p>
            </div>
          </div>

          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why APAC Developers Choose Cloudflare
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className={`w-6 h-6 mt-0.5 mr-3 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                <div>
                  <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Multi-Region Complexity Solved
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Deploy once, run everywhere. No need to manage multiple regions, availability zones, or complex networking.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className={`w-6 h-6 mt-0.5 mr-3 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                <div>
                  <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Compliance Made Simple
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Data localization requirements? Cloudflare's network spans the region with built-in compliance tools.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className={`w-6 h-6 mt-0.5 mr-3 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                <div>
                  <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Cost-Effective Scaling
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    No egress fees mean predictable costs as you scale across the diverse APAC market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Playbook */}
      <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} py-16 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Regional Playbook: Market-Specific Execution
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              APAC isn't a monolith. Our strategy adapts to each market's unique characteristics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl mr-4">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Singapore & Hong Kong
                </h3>
              </div>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                Financial Hubs
              </p>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-orange-500" />
                  <span>Ultra-low latency for trading applications</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-orange-500" />
                  <span>Compliance with MAS and HKMA regulations</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-orange-500" />
                  <span>Zero-trust security for financial services</span>
                </li>
              </ul>
            </div>

            <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  India & Indonesia
                </h3>
              </div>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Mobile-First Markets
              </p>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Optimized for 4G/5G mobile networks</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Local payment gateway integrations</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Multi-language support at the edge</span>
                </li>
              </ul>
            </div>

            <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Japan & South Korea
                </h3>
              </div>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Tech Innovation Leaders
              </p>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>AI/ML workloads at the edge</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Gaming and real-time applications</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Enterprise-grade reliability demands</span>
                </li>
              </ul>
            </div>

            <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mr-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Australia & New Zealand
                </h3>
              </div>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                Privacy-First Markets
              </p>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Data sovereignty compliance</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Government cloud requirements</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Disaster recovery across regions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Agentic Age Section */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-16 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              The Agentic Age: Why Stateful Serverless Wins
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              AI agents need memory, context, and instant global coordination. Traditional architectures weren't built for this.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Traditional Cloud: The Database Bottleneck
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Every AI interaction requires multiple round trips to a central database:
                </p>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li>• Lambda invocation → DynamoDB read (50ms)</li>
                  <li>• Process request → Update state (30ms)</li>
                  <li>• Coordinate agents → More DB calls (100ms+)</li>
                  <li>• Total: 200ms+ per interaction</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg`}>
                <h3 className="text-lg font-bold mb-3">
                  Cloudflare: Compute + State Together
                </h3>
                <p className="text-sm mb-4 opacity-90">
                  Durable Objects keep state where compute happens:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Instant state access (0ms database latency)</li>
                  <li>• WebSocket coordination built-in</li>
                  <li>• Global consistency without complexity</li>
                  <li>• Total: &lt;50ms globally</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Real-World AI Use Cases Enabled
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-4">
                  <Sparkles className="w-8 h-8 text-orange-500 mr-3" />
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Conversational AI
                  </h4>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Multi-turn conversations with perfect memory, no matter where users connect from.
                </p>
              </div>

              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-blue-500 mr-3" />
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Collaborative Agents
                  </h4>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Multiple AI agents working together in real-time, sharing context instantly.
                </p>
              </div>

              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-4">
                  <Globe className="w-8 h-8 text-green-500 mr-3" />
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Global Orchestration
                  </h4>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Coordinate workflows across regions without central bottlenecks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`${isDarkMode ? 'bg-gradient-to-r from-orange-900 to-red-900' : 'bg-gradient-to-r from-orange-500 to-red-500'} py-16`}>
        <div className="px-8 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            The Future is Being Built on Cloudflare
          </h2>
          <p className="text-xl mb-8 text-white opacity-90">
            Join thousands of APAC developers who are shipping faster, scaling globally, and building the next generation of AI applications.
          </p>
          <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Cloudflare provides the foundation. APAC leads the execution.
          </p>
        </div>
      </section>
    </>
  );
};