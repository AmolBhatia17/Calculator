import React, { useState } from 'react';
import { Calculator, Hash, Calendar } from 'lucide-react';
import ScientificCalculator from './components/ScientificCalculator';
import BaseConverter from './components/BaseConverter';
import DateCalculator from './components/DateCalculator';

type CalculatorMode = 'scientific' | 'base' | 'date';

function App() {
  const [currentMode, setCurrentMode] = useState<CalculatorMode>('scientific');

  const modes = [
    { id: 'scientific' as CalculatorMode, label: 'Scientific', icon: Calculator },
    { id: 'base' as CalculatorMode, label: 'Base Converter', icon: Hash },
    { id: 'date' as CalculatorMode, label: 'Date Calculator', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Advanced Calculator Suite
            </h1>
            <p className="text-slate-300">
              Scientific calculations, base conversions, and date computations
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setCurrentMode(mode.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentMode === mode.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  {mode.label}
                </button>
              );
            })}
          </div>

          {/* Calculator Content */}
          <div className="bg-yellow/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
            {currentMode === 'scientific' && <ScientificCalculator />}
            {currentMode === 'base' && <BaseConverter />}
            {currentMode === 'date' && <DateCalculator />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;