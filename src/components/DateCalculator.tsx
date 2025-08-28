import React, { useState, useCallback } from 'react';
import { Calendar, Clock, Plus, Minus } from 'lucide-react';
import { 
  calculateDateDifference, 
  addTimeToDate, 
  subtractTimeFromDate,
  formatDateResult,
  getDateInfo 
} from '../utils/dateUtils';

interface DateState {
  mode: 'difference' | 'add' | 'subtract' | 'age';
  startDate: string;
  endDate: string;
  targetDate: string;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  result: string;
}

const DateCalculator: React.FC = () => {
  const [state, setState] = useState<DateState>({
    mode: 'difference',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    targetDate: new Date().toISOString().split('T')[0],
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    result: '',
  });

  const handleCalculate = useCallback(() => {
    try {
      let result = '';
      
      switch (state.mode) {
        case 'difference':
          result = calculateDateDifference(state.startDate, state.endDate);
          break;
        case 'add':
          result = addTimeToDate(
            state.targetDate, 
            state.years, 
            state.months, 
            state.days, 
            state.hours, 
            state.minutes
          );
          break;
        case 'subtract':
          result = subtractTimeFromDate(
            state.targetDate, 
            state.years, 
            state.months, 
            state.days, 
            state.hours, 
            state.minutes
          );
          break;
        case 'age':
          result = calculateDateDifference(state.startDate, new Date().toISOString().split('T')[0]);
          break;
        default:
          result = 'Invalid calculation mode';
      }
      
      setState(prev => ({ ...prev, result }));
    } catch (error) {
      setState(prev => ({ ...prev, result: 'Error in calculation' }));
    }
  }, [state]);

  const modes = [
    { id: 'difference' as const, label: 'Date Difference', icon: Calendar },
    { id: 'add' as const, label: 'Add Time', icon: Plus },
    { id: 'subtract' as const, label: 'Subtract Time', icon: Minus },
    { id: 'age' as const, label: 'Age Calculator', icon: Clock },
  ];

  const ModeButton: React.FC<{
    mode: typeof state.mode;
    label: string;
    icon: React.ElementType;
  }> = ({ mode, label, icon: Icon }) => (
    <button
      onClick={() => setState(prev => ({ ...prev, mode, result: '' }))}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        state.mode === mode
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const InputField: React.FC<{
    label: string;
    type: string;
    value: string | number;
    onChange: (value: string) => void;
    min?: string;
    max?: string;
  }> = ({ label, type, value, onChange, min, max }) => (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Date Calculator</h2>
        <p className="text-slate-300">Calculate date differences, add/subtract time, and compute age</p>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2 justify-center">
        {modes.map((mode) => (
          <ModeButton
            key={mode.id}
            mode={mode.id}
            label={mode.label}
            icon={mode.icon}
          />
        ))}
      </div>

      {/* Input Forms */}
      <div className="bg-slate-800/50 rounded-xl p-6">
        {state.mode === 'difference' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Start Date"
              type="date"
              value={state.startDate}
              onChange={(value) => setState(prev => ({ ...prev, startDate: value }))}
            />
            <InputField
              label="End Date"
              type="date"
              value={state.endDate}
              onChange={(value) => setState(prev => ({ ...prev, endDate: value }))}
            />
          </div>
        )}

        {state.mode === 'age' && (
          <div>
            <InputField
              label="Birth Date"
              type="date"
              value={state.startDate}
              onChange={(value) => setState(prev => ({ ...prev, startDate: value }))}
            />
          </div>
        )}

        {(state.mode === 'add' || state.mode === 'subtract') && (
          <div className="space-y-4">
            <InputField
              label="Target Date"
              type="date"
              value={state.targetDate}
              onChange={(value) => setState(prev => ({ ...prev, targetDate: value }))}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <InputField
                label="Years"
                type="number"
                value={state.years}
                onChange={(value) => setState(prev => ({ ...prev, years: parseInt(value) || 0 }))}
                min="0"
              />
              <InputField
                label="Months"
                type="number"
                value={state.months}
                onChange={(value) => setState(prev => ({ ...prev, months: parseInt(value) || 0 }))}
                min="0"
                max="11"
              />
              <InputField
                label="Days"
                type="number"
                value={state.days}
                onChange={(value) => setState(prev => ({ ...prev, days: parseInt(value) || 0 }))}
                min="0"
              />
              <InputField
                label="Hours"
                type="number"
                value={state.hours}
                onChange={(value) => setState(prev => ({ ...prev, hours: parseInt(value) || 0 }))}
                min="0"
                max="23"
              />
              <InputField
                label="Minutes"
                type="number"
                value={state.minutes}
                onChange={(value) => setState(prev => ({ ...prev, minutes: parseInt(value) || 0 }))}
                min="0"
                max="59"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleCalculate}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Calculate
        </button>
      </div>

      {/* Result Display */}
      {state.result && (
        <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl p-6">
          <h3 className="text-white font-medium text-lg mb-3">Result</h3>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-emerald-400 text-xl font-mono whitespace-pre-line">
              {state.result}
            </div>
          </div>
        </div>
      )}

      {/* Quick Date Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 rounded-xl p-6">
          <h3 className="text-white font-medium text-lg mb-4">Today's Information</h3>
          <div className="space-y-2 text-sm">
            {getDateInfo(new Date().toISOString().split('T')[0]).split('\n').map((line, index) => (
              <div key={index} className="text-slate-300">{line}</div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-6">
          <h3 className="text-white font-medium text-lg mb-4">Quick Examples</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-blue-400 font-medium">Date Difference</div>
              <div className="text-slate-300">Find days between two dates</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-green-400 font-medium">Add Time</div>
              <div className="text-slate-300">Add years, months, days to a date</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-purple-400 font-medium">Age Calculator</div>
              <div className="text-slate-300">Calculate exact age in years, months, days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateCalculator;