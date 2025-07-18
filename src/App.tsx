import React, { useState, useEffect } from 'react';
import { Moon, Sun, Cloud, Github, Sparkles } from 'lucide-react';
import { StreamingArchitectureDemo } from './components/streaming/StreamingArchitectureDemo';
import { CompleteWhitepaper } from './components/CompleteWhitepaper';
import { UserInput } from './types';

const SVG_PATTERN = 'data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

function App() {
  const [currentPersona, setCurrentPersona] = useState<UserInput['persona']>('Vibe Coder');
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auto-cycle through personas
  useEffect(() => {
    if (!isAutoCycling) return;
    
    const personas: UserInput['persona'][] = ['Vibe Coder', 'AIE/FDE', 'CIO/CTO'];
    const interval = setInterval(() => {
      setCurrentPersona(prev => {
        const currentIndex = personas.indexOf(prev);
        const nextIndex = (currentIndex + 1) % personas.length;
        return personas[nextIndex];
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoCycling]);


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
      case 'AIE/FDE':
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

  // Check if we should show the whitepaper
  const showWhitepaper = window.location.search.includes('whitepaper=true');

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
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>The Edge Advantage</p>
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
                currentPersona === 'AIE/FDE' ? 'from-blue-400 via-cyan-400 to-teal-400' :
                'from-orange-400 via-red-400 to-pink-400'
              } bg-clip-text text-transparent transition-all duration-500`}>
                {currentPersona === 'Vibe Coder' ? 'Vibe Coders of the World Unite!' :
                 currentPersona === 'AIE/FDE' ? 'Ship Your App to Region: 🌍' :
                 'Make Infra Your Advantage'}
              </h1>
              <p className={`text-xl md:text-2xl mt-4 font-medium transition-all duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {currentPersona === 'Vibe Coder' ? 'Go from vibe to prod in minutes with Cloudflare' :
                 currentPersona === 'AIE/FDE' ? 'Deploy AI-native services globally with 0 DevOps' :
                 'Day 1 compliance + global scale at half the cost'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="space-y-0">
        <StreamingArchitectureDemo
          isDarkMode={isDarkMode}
          currentPersona={currentPersona}
          onPersonaChange={handlePersonaChange}
        />
      </main>

      {/* Whitepaper Content - Only show if ?whitepaper=true */}
      {showWhitepaper && <CompleteWhitepaper isDarkMode={isDarkMode} />}

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
