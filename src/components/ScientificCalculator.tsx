import React, { useState, useCallback, useEffect } from 'react';
import { Delete, RotateCcw } from 'lucide-react';
import { evaluateExpression, formatNumber } from '../utils/calculatorUtils';

interface CalculatorState {
  display: string;
  expression: string;
  memory: number;
  history: string[];
  angleMode: 'deg' | 'rad';
}

const ScientificCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    expression: '',
    memory: 0,
    history: [],
    angleMode: 'deg',
  });

  const addToHistory = useCallback((expression: string, result: string) => {
    setState(prev => ({
      ...prev,
      history: [`${expression} = ${result}`, ...prev.history].slice(0, 10)
    }));
  }, []);

  const handleNumber = useCallback((num: string) => {
    setState(prev => ({
      ...prev,
      display: prev.display === '0' ? num : prev.display + num,
      expression: prev.expression + num
    }));
  }, []);

  const handleOperator = useCallback((op: string) => {
    setState(prev => ({
      ...prev,
      display: '0',
      expression: prev.expression + ` ${op} `
    }));
  }, []);

  const handleFunction = useCallback((func: string) => {
    // Handle special functions that need different input formats
    if (func === 'factorial') {
      setState(prev => ({
        ...prev,
        expression: prev.expression + 'factorial('
      }));
      return;
    }
    
    if (func === 'combination') {
      setState(prev => ({
        ...prev,
        expression: prev.expression + 'combination('
      }));
      return;
    }
    
    if (func === 'permutation') {
      setState(prev => ({
        ...prev,
        expression: prev.expression + 'permutation('
      }));
      return;
    }
    if(func==='ceil'){
      setState(prev=>({
        ...prev,
        expression:prev.expression+'ceil('
      }));
      return;
    }
    
    setState(prev => ({
      ...prev,
      display: func,
      expression: prev.expression + `${func}(`
    }));
  }, []);

  const handleEquals = useCallback(() => {
    try {
      // Add missing closing parentheses if needed
      let completeExpression = state.expression;
      const openParens = (state.expression.match(/\(/g) || []).length;
      const closeParens = (state.expression.match(/\)/g) || []).length;
      const missingParens = openParens - closeParens;
      
      if (missingParens > 0) {
        completeExpression += ')'.repeat(missingParens);
      }

      const result = evaluateExpression(completeExpression, state.angleMode);
      const formattedResult = formatNumber(result);
      addToHistory(completeExpression, formattedResult);
      setState(prev => ({
        ...prev,
        display: formattedResult,
        expression: formattedResult
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        display: 'Error'
      }));
    }
  }, [state.expression, state.angleMode, addToHistory]);

  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: '0',
      expression: ''
    }));
  }, []);

  const handleBackspace = useCallback(() => {
    setState(prev => {
      const newExpression = prev.expression.slice(0, -1);
      return {
        ...prev,
        display: newExpression || '0',
        expression: newExpression
      };
    });
  }, []);

  // Memory functions
  const handleMemoryAdd = useCallback(() => {
    const currentValue = parseFloat(state.display) || 0;
    setState(prev => ({
      ...prev,
      memory: prev.memory + currentValue
    }));
  }, [state.display]);

  const handleMemorySubtract = useCallback(() => {
    const currentValue = parseFloat(state.display) || 0;
    setState(prev => ({
      ...prev,
      memory: prev.memory - currentValue
    }));
  }, [state.display]);

  const handleMemoryRecall = useCallback(() => {
    const memoryValue = formatNumber(state.memory);
    setState(prev => ({
      ...prev,  
      display: memoryValue,
      expression: memoryValue
    }));
  }, [state.memory]);

  const handleMemoryClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      memory: 0
    }));
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (/[0-9.]/.test(key)) {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNumber, handleOperator, handleEquals, handleClear, handleBackspace]);

  const Button: React.FC<{
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
  }> = ({ onClick, className = '', children }) => (
    <button
      onClick={onClick}
      className={`h-14 rounded-lg font-medium transition-all duration-150 hover:scale-105 active:scale-95 shadow-lg ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Calculator */}
      <div className="lg:col-span-3">
        {/* Display */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <div className="text-slate-400 text-sm mb-1">{state.expression || '0'}</div>
          <div className="text-white text-3xl font-mono">{state.display}</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-slate-400 text-xs">
              Mode: {state.angleMode.toUpperCase()}
            </span>
            <span className="text-slate-400 text-xs">
              Memory: {formatNumber(state.memory)}
            </span>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-6 gap-3">
          {/* Row 1 */}
          <Button
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 text-white col-span-2"
          >
            Clear
          </Button>
          <Button
            onClick={handleBackspace}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center"
          >
            <Delete size={18} />
          </Button>
          <Button
            onClick={() => setState(prev => ({ ...prev, angleMode: prev.angleMode === 'deg' ? 'rad' : 'deg' }))}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {state.angleMode}
          </Button>
          <Button
            onClick={handleMemoryAdd}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            M+
          </Button>
          <Button
            onClick={handleMemorySubtract}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            M-
          </Button>

          {/* Row 2 */}
          <Button
            onClick={() => handleFunction('sin')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            sin
          </Button>
          <Button
            onClick={() => handleFunction('cos')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            cos
          </Button>
          <Button
            onClick={() => handleFunction('tan')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            tan
          </Button>
          <Button
            onClick={() => handleNumber('7')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            7
          </Button>
          <Button
            onClick={() => handleNumber('8')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            8
          </Button>
          <Button
            onClick={() => handleNumber('9')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            9
          </Button>

          {/* Row 3 */}
          <Button
            onClick={() => handleFunction('log')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            log
          </Button>
          <Button
            onClick={() => handleFunction('ln')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            ln
          </Button>
          <Button
            onClick={() => handleOperator('^')}
            className="bg-indigo-600 hover:bg-blue-700 text-white"
          >
            x^y
          </Button>
          <Button
            onClick={() => handleNumber('4')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            4
          </Button>
          <Button
            onClick={() => handleNumber('5')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            5
          </Button>
          <Button
            onClick={() => handleNumber('6')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            6
          </Button>

          {/* Row 4 */}
          <Button
            onClick={() => handleFunction('combination')}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            nCr
          </Button>
          <Button
            onClick={() => handleFunction('permutation')}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            nPr
          </Button>
          <Button
            onClick={() => handleFunction('factorial')}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            n!
          </Button>
          <Button
            onClick={() => handleNumber('1')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            1
          </Button>
          <Button
            onClick={() => handleNumber('2')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            2
          </Button>
          <Button
            onClick={() => handleNumber('3')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            3
          </Button>

          {/* Row 5 */}
          <Button
            onClick={() => handleNumber('(')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            (
          </Button>
          <Button
            onClick={() => handleNumber(')')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            )
          </Button>
          <Button
            onClick={() => handleFunction('sqrt')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            √x
          </Button>
          <Button
            onClick={() => handleNumber('0')}
            className="bg-slate-700 hover:bg-slate-600 text-white col-span-2"
          >
            0
          </Button>
          <Button
            onClick={() => handleNumber('.')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            .
          </Button>

          {/* Row 6 */}
          <Button
            onClick={() => handleNumber(',')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            ,
          </Button>
          <Button
            onClick={() => handleNumber('π')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            π
          </Button>
          <Button
            onClick={() => handleNumber('e')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            e
          </Button>
          <Button
            onClick={() => handleOperator('*')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
          x
          </Button>
            <Button
            onClick={() => handleOperator('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            ÷
          </Button>
          <Button
            onClick={() => handleOperator('-')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            -
          </Button>

          {/* Row 7 */}
          <Button
            onClick={handleMemoryClear}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            MC
          </Button>
          <Button
            onClick={handleMemoryAdd}
            className="bg-green-600 hover:bg-green-700 text-white" 
          >
            MR
          </Button>
          <Button
            onClick={() => handleFunction('floor')} 
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            L X ⅃
          </Button>
          <Button
            onClick={() => handleOperator('+')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            +
          </Button>
          <Button
            onClick={handleEquals}
            className="bg-emerald-600 hover:bg-emerald-700 text-white col-span-2"
          >
            =
          </Button>
        </div>
      </div>

      {/* History Panel */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">History</h3>
          <button
            onClick={() => setState(prev => ({ ...prev, history: [] }))}
            className="text-slate-400 hover:text-white"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {state.history.map((item, index) => (
            <div
              key={index}
              className="text-sm text-slate-300 p-2 rounded bg-slate-700/50 hover:bg-slate-700 cursor-pointer transition-colors"
              onClick={() => {
                const result = item.split(' = ')[1];
                setState(prev => ({
                  ...prev,
                  display: result,
                  expression: result
                }));
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;