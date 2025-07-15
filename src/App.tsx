import React, { useState, useEffect } from 'react';
import { Moon, Sun, Cloud, Database, Globe, Server, Shield, DollarSign, CheckCircle, ArrowRight, Github, Zap, Sparkles } from 'lucide-react';
import { ControlPanel } from './components/ControlPanel';
import { DiagramCanvas } from './components/DiagramCanvas';
import { AdvantagesPanel } from './components/AdvantagesPanel';
import { CompetitiveLandscape } from './components/CompetitiveLandscape';
import { generateArchitecture } from './services/architectureService';
import { UserInput, ArchitectureResponse } from './types';

const SVG_PATTERN = 'data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ArchitectureResponse | null>(null);
  const [currentPersona, setCurrentPersona] = useState<UserInput['persona']>('Vibe Coder');
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);

  // Auto-cycle through personas
  useEffect(() => {
    if (!isAutoCycling) return;
    
    const personas: UserInput['persona'][] = ['Vibe Coder', 'FDE', 'CIO/CTO'];
    const interval = setInterval(() => {
      setCurrentPersona(prev => {
        const currentIndex = personas.indexOf(prev);
        const nextIndex = (currentIndex + 1) % personas.length;
        return personas[nextIndex];
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoCycling]);

  const handleGenerate = async (input: UserInput) => {
    setLoading(true);
    setResponse(null);
    setCurrentInput(input);
    
    try {
      const result = await generateArchitecture(input);
      setResponse(result);
    } catch (error) {
      console.error('Error generating architecture:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaChange = (persona: UserInput['persona']) => {
    setCurrentPersona(persona);
    setIsAutoCycling(false); // Stop auto-cycling when user manually selects
  };

  const getPersonaTheme = (persona: UserInput['persona']) => {
    switch (persona) {
      case 'Vibe Coder':
        return {
          pageBackground: isDarkMode ? 'bg-gray-900' : 'bg-white',
          heroBackground: isDarkMode ? 'bg-gradient-to-br from-purple-800 via-pink-800 to-purple-800' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100',
          headerAccent: 'from-purple-500 to-pink-500'
        };
      case 'FDE':
        return {
          pageBackground: isDarkMode ? 'bg-gray-900' : 'bg-white',
          heroBackground: isDarkMode ? 'bg-gradient-to-br from-blue-800 via-cyan-800 to-blue-800' : 'bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-100',
          headerAccent: 'from-blue-500 to-cyan-500'
        };
      case 'CIO/CTO':
        return {
          pageBackground: isDarkMode ? 'bg-gray-900' : 'bg-white',
          heroBackground: isDarkMode ? 'bg-gradient-to-br from-orange-800 via-red-800 to-orange-800' : 'bg-gradient-to-br from-orange-100 via-red-100 to-orange-100',
          headerAccent: 'from-orange-500 to-red-500'
        };
    }
  };

  const theme = getPersonaTheme(currentPersona);

  return (
    <div className={`min-h-screen ${theme.pageBackground}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 bg-gradient-to-r ${theme.headerAccent} rounded-xl`}>
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Vibe to Prod</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>The APAC Edge Blueprint</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${theme.heroBackground}`}>
        <div className={`absolute inset-0 bg-[url('${SVG_PATTERN}')] opacity-20`}></div>
        <div className="relative px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className={`text-5xl md:text-7xl font-bold bg-gradient-to-r ${
                currentPersona === 'Vibe Coder' ? 'from-purple-400 via-pink-400 to-red-400' :
                currentPersona === 'FDE' ? 'from-blue-400 via-cyan-400 to-teal-400' :
                'from-orange-400 via-red-400 to-pink-400'
              } bg-clip-text text-transparent transition-all duration-500`}>
                {currentPersona === 'Vibe Coder' ? 'Vibe Coders of the World Unite!' :
                 currentPersona === 'FDE' ? 'Frontend Developers, Build Without Limits!' :
                 'Leaders, Scale with Confidence!'}
              </h1>
              <p className={`text-xl md:text-2xl mt-6 font-medium transition-all duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {currentPersona === 'Vibe Coder' ? 'Go from vibe to prod in minutes with Cloudflare' :
                 currentPersona === 'FDE' ? 'Deploy globally with zero backend complexity' :
                 'Enterprise-grade infrastructure that just works'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="space-y-0">
        {/* Control Panel */}
        <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} py-12`}>
          <div className="px-8">
            <ControlPanel onGenerate={handleGenerate} loading={loading} onPersonaChange={handlePersonaChange} isDarkMode={isDarkMode} />
          </div>
        </section>

        {/* Results Section */}
        {(response || loading) && (
          <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-12 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-8 space-y-8">
              {/* Section Header */}
              <div className="text-center">
                <h2 className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Architecture Comparison
                </h2>
                <p className={`text-base ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  See how Cloudflare stacks up against traditional solutions
                </p>
              </div>

              {/* Diagrams Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DiagramCanvas
                  title="Cloudflare Architecture"
                  data={response?.cloudflare || null}
                  loading={loading}
                  variant="cloudflare"
                  isDarkMode={isDarkMode}
                />
                <DiagramCanvas
                  title="Traditional Architecture"
                  data={response?.competitor || null}
                  loading={loading}
                  variant="competitor"
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Why Cloudflare Section */}
            </div>
          </section>
        )}

        {/* Why Cloudflare Section */}
        {(response || loading) && (
          <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} py-12 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-8">
              <AdvantagesPanel 
                advantages={response?.advantages || []} 
                loading={loading} 
                persona={currentPersona}
                isDarkMode={isDarkMode}
                constraints={currentInput?.constraints || []}
                appDescription={currentInput?.appDescription || ""}
                competitor={currentInput?.competitors[0] || "AWS"}
              />
            </div>
          </section>
        )}
      </main>

      {/* Whitepaper Sections - Always Visible */}
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
                  A <code className={`px-2 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-700 text-orange-400' : 'bg-gray-100 text-orange-600'}`}>git push</code> deploys globally by default.
                </p>
              </div>

              <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4">
                    <Cloud className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Shrink Prompt-to-Product Distance
                  </h3>
                </div>
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  In the AI era, the window of opportunity is measured in weeks, not quarters. 
                  The interactive demo above did in 500ms what takes teams of engineers weeks to accomplish.
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
                Positioning: The Modern Application Landscape
              </h2>
              <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                To understand where to build, you must first understand the landscape. A competitive matrix helps clarify the trade-offs developers are forced to make and highlights the unique position Cloudflare occupies.
              </p>
            </div>

            {/* Competitive Landscape Chart */}
            <div className={`rounded-xl shadow-lg overflow-hidden mb-12 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="p-6">
                <CompetitiveLandscape isDarkMode={isDarkMode} />
              </div>
            </div>

            {/* Interpreting the Matrix */}
            <div className="mb-12">
              <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Interpreting the Matrix: A Tale of Four Quadrants
              </h3>
              <p className={`text-base mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                This is not just a chart; it's a map of the industry's architectural tensions:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    The Incumbent Powerhouses (Bottom-Right)
                  </h4>
                  <p className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    AWS, GCP, Azure
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    These hyperscalers offer immense operational efficiency and a vast buffet of services, making them a CIO's trusted choice. However, this power comes at the cost of complexity—"death by a thousand paper cuts."
                  </p>
                </div>

                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    The Velocity Kings (Top-Left)
                  </h4>
                  <p className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Vercel, Netlify
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    These specialist PaaS providers offer unparalleled developer experience for the frontend. However, this simplicity can become a gilded cage as applications scale.
                  </p>
                </div>

                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    The AI Disruptors (Bottom-Left)
                  </h4>
                  <p className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Modal Labs, Replicate
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Hyper-focused on making AI model deployment trivial. Perfect example of "prompt-to-product" ethos but not a complete application platform.
                  </p>
                </div>

                <div className={`p-6 rounded-xl border-2 ${isDarkMode ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
                  <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    The Convergent Leader (Top-Right)
                  </h4>
                  <p className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Cloudflare
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Uniquely positioned, converging world-class developer experience with strategic efficiency and breadth. Our globally distributed architecture addresses the core challenge of the AI-native era.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className={`w-full rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <thead className="bg-gradient-to-r from-orange-500 to-red-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Capability</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Cloudflare</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Hyperscalers</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Specialist PaaS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                    <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Architecture</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Globally Distributed by Default
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ❌ Centralized by Default
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚠️ Hybrid (Fast Frontend, Slow Backend)
                      </span>
                    </td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ The Uncontested Leader
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ❌ Slow for Global Users
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚠️ Deceptively Fast
                      </span>
                    </td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                    <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Developer Experience</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Integrated & Simple
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ❌ Vast & Complex
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚠️ Excellent (for Frontend)
                      </span>
                    </td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI/ML</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Edge-First AI
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚠️ The Training Behemoth
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ❌ Integration-Only
                      </span>
                    </td>
                  </tr>
                  <tr className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                    <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pricing</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Predictable & Fair
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ❌ Complex & Punitive
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚠️ Simple Start, Expensive at Scale
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Market Section */}
        <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-16 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                The Challenge: Cloudflare's Compute Blind Spot
              </h2>
              <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto mb-8`}>
                Our barrier isn't technology—it's awareness. We're absent from Gartner's 2024 Magic Quadrant for Strategic Cloud Platform Services. 
                APAC's developer-driven markets are our biggest opportunity to change that.
              </p>
              
              {/* The Imperative */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'} max-w-4xl mx-auto`}>
                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                  The APAC Imperative: Developer Education → Enterprise Revenue
                </h3>
                <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  APAC's mobile-first, latency-sensitive markets are perfect for developer-first adoption. 
                  When we win developer mindshare through education, we unlock enterprise revenue streams.
                </p>
              </div>
            </div>

            {/* The Engine: Developer Love Flywheel */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  The Engine: Dev ❤️ Flywheel
                </h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                  Our bottom-up go-to-market motion is foundational to winning in APAC. We turn developer love into enterprise revenue.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Win the Developer</h3>
                  <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Superior DX, undeniable performance, and radical generosity in our free tiers. They become our internal champions.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Empower the Champion</h3>
                  <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    We equip developers to make the business case to their CTO with performance numbers and cost savings.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Capture the Organization</h3>
                  <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    CTO approves adoption based on proven use case, leading to broader platform usage and enterprise agreements.
                  </p>
                </div>
              </div>

              <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community Engagement Strategy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>🇸🇬 Singapore</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Partner with Geekcamp, JuniorDev.sg, and FinTech-specific developer meetups.
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>🇮🇩 Jakarta</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Engage with Creator Economy communities and Super App developer groups.
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>🇰🇷 Seoul</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Run hands-on workshops at if(kakao) and gaming dev conferences.
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>🇦🇺 Sydney</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Sponsor local SaaS and JavaScript meetups, providing Cloudflare experts as mentors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Execution: Flywheel-Powered Dual Attack */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  The Execution: Flywheel-Powered Dual Attack
                </h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                  Same flywheel, different entry points. Use developer love to win both new workloads and infiltrate existing infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Track 1: Win New AI Workloads */}
                <div className={`relative p-8 rounded-xl shadow-lg border-2 ${isDarkMode ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="absolute -top-4 left-8">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Track 1: Priority
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h4 className={`text-xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                        Win New AI Workloads
                      </h4>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed mb-4`}>
                      <strong>Flywheel Entry:</strong> Developer education → organic adoption → front-of-mind for "vibe coders" 
                      building AI-native applications from scratch.
                    </p>
                    <div className={`text-xs ${isDarkMode ? 'text-orange-300' : 'text-orange-700'} font-semibold`}>
                      🎯 Eat Vercel/Netlify for breakfast with superior edge + AI capabilities
                    </div>
                  </div>
                </div>

                {/* Track 2: Infiltrate Existing Infrastructure */}
                <div className={`relative p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                  <div className="absolute -top-4 left-8">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Track 2: Expand
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Infiltrate Existing Infrastructure
                      </h4>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed mb-4`}>
                      <strong>Flywheel Entry:</strong> AI Gateway as "bouncer" → developer champions → 
                      prove value with stateful workloads → entire platform migration.
                    </p>
                    <div className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'} font-semibold`}>
                      🎯 From bouncer to backbone: leverage security trust for compute wins
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Enablers: Product Strategy for Track 1 Dominance */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  The Enablers: Product Strategy for Track 1 Dominance
                </h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                  To accelerate developer flywheel and win new AI workloads, we need dramatic DX/AX improvements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* DX Improvements */}
                <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Enhance Developer Experience
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>1. One-Click AI App Templates</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pre-built ChatGPT clones, RAG apps, AI agents with Workers AI, Vectorize, D1 pre-configured.</p>
                    </div>
                    <div>
                      <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>2. Visual Deployment Pipeline</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Git-to-global deployment with real-time edge rollout visualization.</p>
                    </div>
                    <div>
                      <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>3. AI-Powered CLI Assistant</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>"Deploy my React app with AI chat" → auto-configured stack.</p>
                    </div>
                  </div>
                </div>

                {/* AX Preparation */}
                <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Prepare for Agent Experience
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>1. Agent-Native APIs</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tool-calling APIs for AI agents to auto-provision infrastructure.</p>
                    </div>
                    <div>
                      <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>2. Conversational Infrastructure</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>"Scale my app for 10M users" → AI auto-configures everything.</p>
                    </div>
                    <div>
                      <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>3. Predictive Edge Optimization</h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI learns patterns and auto-optimizes edge placement.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitive Advantage */}
              <div className={`mt-8 p-6 rounded-xl ${isDarkMode ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50 border border-orange-200'}`}>
                <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                  The Vercel/Netlify Killer Advantage
                </h4>
                <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  While Vercel/Netlify excel at frontend deployment, they hit walls with backend complexity and global scale. 
                  Our edge-first architecture + these DX improvements = superior platform for AI-native applications.
                </p>
              </div>
            </div>

            {/* Regional Implementation */}
            <div className="mb-12">
              <h2 className={`text-4xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                The Regional Playbook: Market-Specific Execution
              </h2>
              <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-center max-w-3xl mx-auto mb-8`}>
                APAC is not one market. Here's how we execute both tracks simultaneously in specific hubs where talent, industry, and technical need intersect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Singapore Card */}
              <div className="h-80 group cursor-pointer" style={{ perspective: '1000px' }}>
                <div 
                  className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:[transform:rotateY(180deg)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-center mb-6">
                      <span className="text-3xl mr-4">🇸🇬</span>
                      <div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Singapore</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>The FinTech & WealthTech Hub</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Target Industries</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>FinTech, WealthTech, Regional HQs, Cross-Border Payments</p>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Key Players</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Grab Financial Group, Nium, Revolut SG, Wise, Endowus</p>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Market Data</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>FinTech market projected to reach $46B+ in 2024. Success defined by speed and security.</p>
                      </div>
                    </div>
                    <div className={`absolute bottom-4 right-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Hover for Cloudflare pitch →
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50 border-orange-200'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-800' : 'bg-orange-200'} mr-3`}>
                        <span className="text-lg">⚡</span>
                      </div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                        Secure, Low-Latency Transactions
                      </h4>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      "For a company like Nium, processing millions of cross-border payments, latency is the killer. Your competitor's payment gateway, running on a centralized cloud, takes 300ms. With Cloudflare, we run identity verification, fraud checks, and transaction authorization using Durable Objects and Workers at the edge in under 50ms—from anywhere in SEA. This is a tangible competitive advantage."
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-80 group cursor-pointer" style={{ perspective: '1000px' }}>
                <div 
                  className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:[transform:rotateY(180deg)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-center mb-6">
                      <span className="text-3xl mr-4">🇮🇩</span>
                      <div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Indonesia</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>E-commerce & Super App Battleground</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Target Industries</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>E-commerce, Super Apps, Creator Economy, Digital Banking</p>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Key Players</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>GoTo (Gojek & Tokopedia), Grab, Sea Group (Shopee), Traveloka</p>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Market Data</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Largest SEA e-commerce market, GMV exceeded $80B in 2022. Success = handling massive concurrent loads.</p>
                      </div>
                    </div>
                    <div className={`absolute bottom-4 right-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Hover for Cloudflare pitch →
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50 border-orange-200'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-800' : 'bg-orange-200'} mr-3`}>
                        <span className="text-lg">🛒</span>
                      </div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                        Real-time Personalization & Flash Sales
                      </h4>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      "During a Tokopedia 12.12 flash sale, millions of users hit 'buy' simultaneously. A centralized architecture crumbles. With Cloudflare, every user gets their own stateful 'shopping cart' via a Durable Object at the edge. This ensures inventory checks are instant, carts don't drop items, and the user experience is flawless, directly translating to higher conversion rates."
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-80 group cursor-pointer" style={{ perspective: '1000px' }}>
                <div 
                  className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:[transform:rotateY(180deg)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-center mb-6">
                      <span className="text-3xl mr-4">🇰🇷🇯🇵</span>
                      <div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Seoul / Tokyo</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Interactive Entertainment Frontier</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Target Industries</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gaming, Interactive Entertainment, AI R&D, Virtual Worlds</p>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Key Players</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nexon, Krafton (PUBG), NCSoft, Square Enix, Bandai Namco</p>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Market Data</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>South Korean gaming market valued at $15B+, with massive player base sensitive to latency.</p>
                      </div>
                    </div>
                    <div className={`absolute bottom-4 right-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Hover for Cloudflare pitch →
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50 border-orange-200'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-800' : 'bg-orange-200'} mr-3`}>
                        <span className="text-lg">🎮</span>
                      </div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                        Real-time State Management & Edge AI
                      </h4>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      "Lag kills games. For a title from Krafton or Nexon, a centralized game server in Virginia is unacceptable for players in Seoul. What if the game state, matchmaking logic, and anti-cheat services lived at the edge, milliseconds from your players? We can manage real-time player state with Durable Objects and even run lightweight AI for NPCs directly on our network."
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-80 group cursor-pointer" style={{ perspective: '1000px' }}>
                <div 
                  className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:[transform:rotateY(180deg)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-center mb-6">
                      <span className="text-3xl mr-4">🇦🇺</span>
                      <div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sydney</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>High-Value SaaS Corridor</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Target Industries</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>B2B SaaS, Digital Agencies, Media Technology</p>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Key Players</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Canva, Atlassian, SafetyCulture, Culture Amp</p>
                      </div>
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Market Data</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mature SaaS market, globally focused companies serving US/Europe customers. Performance and cost critical.</p>
                      </div>
                    </div>
                    <div className={`absolute bottom-4 right-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Hover for Cloudflare pitch →
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50 border-orange-200'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-800' : 'bg-orange-200'} mr-3`}>
                        <span className="text-lg">💰</span>
                      </div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                        High-Performance SaaS & Cost Optimization
                      </h4>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      "Your AWS bill is spiraling from egress fees as you serve your global customer base from us-east-1. For a company like Canva, serving petabytes of assets, that bill runs into the millions. With R2, that specific bill goes to zero. We can host your entire SaaS backend on a single, predictable platform, dramatically improving both performance and your gross margin."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* The Agentic Age Section */}
        <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-16 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-8 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                The Agentic Age: Why Stateful Serverless is the New Full-Stack
              </h2>
              <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Why Now? The Great Re-Platforming.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  The Architectural Shift
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  We are at the dawn of the Agentic Age—transitioning from static applications to persistent, conversational AI systems. 
                  The old cloud model, built on stateless request-response cycles, is fundamentally broken for this new reality.
                </p>
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Forcing an AI to retrieve its "memory" from a centralized database across an ocean on every interaction creates 
                  the <span className="font-semibold text-orange-500">crippling latency tax</span> we identified in our compute awareness gap analysis.
                </p>
              </div>

              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  The Cloudflare Solution
                </h3>
                <p className={`text-base leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold text-orange-500">Stateful Serverless is the new full-stack.</span> A Durable Object 
                  isn't merely a database record—it's the native data structure for an AI agent's memory, fused directly with compute logic.
                </p>
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  This eliminates the distance penalty that plagues centralized architectures, delivering the 
                  <span className="font-semibold text-orange-500">zero-distance advantage</span> our flywheel strategy requires.
                </p>
              </div>
            </div>

            <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} mb-8`}>
              <h3 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                The Unfair Advantage: We Started with the Edge
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance Gap</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    AI running milliseconds from data vs. distant data center isn't incremental—it's a categorical leap in user experience.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Global by Default</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    A single git push gives developers in Singapore the same low-latency reach as tech giants—no regional compromise.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Economic Fairness</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    R2's zero-egress policy removes the punitive tax on success, enabling true global scaling from day one.
                  </p>
                </div>
              </div>
            </div>

            <div className={`text-center p-8 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
              <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Building a More Intelligent Internet
              </h3>
              <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This architecture powers our mission evolution: from a faster, safer internet to a 
                <span className="font-semibold text-orange-500">more intelligent internet</span>. 
                The agentic economy requires infrastructure that thinks at the speed of conversation.
              </p>
              <p className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                The future won't be centralized. It will be built by everyone, for everyone, at the edge.
              </p>
              <p className={`text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent`}>
                Cloudflare provides the foundation. APAC leads the execution.
              </p>
            </div>
          </div>
        </section>
      </>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <Sparkles className="w-4 h-4" />
              <span>Powered by Cloudflare</span>
            </div>
            <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Made with ❤️ by erniesg</span>
              <Github className="w-4 h-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;