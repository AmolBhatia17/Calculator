import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

type Base = 'decimal' | 'binary' | 'octal' | 'hexadecimal';

interface BaseState {
  decimal: string;
  binary: string;
  octal: string;
  hexadecimal: string;
  copied: string | null;
}

// Move BaseInput outside of BaseConverter to prevent re-creation on every render
const BaseInput: React.FC<{
  label: string;
  value: string;
  base: Base;
  placeholder: string;
  description: string;
  copied: string | null;
  onInputChange: (value: string, base: Base) => void;
  onCopy: (value: string, base: string) => void;
}> = ({ label, value, base, placeholder, description, copied, onInputChange, onCopy }) => (
  <div className="bg-slate-800/50 rounded-xl p-6">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="text-white font-medium text-lg">{label}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <button
        onClick={() => onCopy(value, base)}
        className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
      >
        {copied === base ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onInputChange(e.target.value, base)}
      placeholder={placeholder}
      className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 font-mono text-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
    />
    <div className="mt-2 text-xs text-slate-500">
      {base === 'binary' && 'Valid: 0, 1'}
      {base === 'octal' && 'Valid: 0-7'}
      {base === 'decimal' && 'Valid: 0-9'}
      {base === 'hexadecimal' && 'Valid: 0-9, A-F'}
    </div>
  </div>
);

const BaseConverter: React.FC = () => {
  const [state, setState] = useState<BaseState>({
    decimal: null,
    binary: null,
    octal: null,
    hexadecimal: null,
    copied: null,
  });

  const validateInput = useCallback((value: string, base: Base): string => {
    if (!value) return '';
    
    let validChars: string;
    switch (base) {
      case 'binary':
        validChars = '01';
        break;
      case 'octal':
        validChars = '01234567';
        break;
      case 'decimal':
        validChars = '0123456789';
        break;
      case 'hexadecimal':
        validChars = '0123456789ABCDEFabcdef';
        break;
      default:
        return value;
    }

    return value.split('').filter(char => validChars.includes(char)).join('');
  }, []);

  const convertFromDecimal = useCallback((decimal: number) => {
    if (isNaN(decimal) || decimal < 0) {
      return {
        decimal: '0',
        binary: '0',
        octal: '0',
        hexadecimal: '0',
      };
    }

    return {
      decimal: decimal.toString(),
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      hexadecimal: decimal.toString(16).toUpperCase(),
    };
  }, []);

  const handleInputChange = useCallback((value: string, base: Base) => {
    const validatedValue = validateInput(value, base);
    
    if (validatedValue === '') {
      setState({
        decimal: '',
        binary: '',
        octal: '',
        hexadecimal: '',
        copied: null,
      });
      return;
    }

    try {
      let decimal: number;
      
      switch (base) {
        case 'decimal':
          decimal = parseInt(validatedValue, 10);
          break;
        case 'binary':
          decimal = parseInt(validatedValue, 2);
          break;
        case 'octal':
          decimal = parseInt(validatedValue, 8);
          break;
        case 'hexadecimal':
          decimal = parseInt(validatedValue, 16);
          break;
        default:
          decimal = 0;
      }

      if (isNaN(decimal)) {
        decimal = 0;
      }

      const converted = convertFromDecimal(decimal);
      
      // Keep the user's input in the field they're typing in
      setState(prev => ({
        ...prev,
        ...converted,
        [base]: validatedValue,
      }));
    } catch (error) {
      // If conversion fails, just update the current field
      setState(prev => ({
        ...prev,
        [base]: validatedValue,
      }));
    }
  }, [validateInput, convertFromDecimal]);

  const copyToClipboard = useCallback(async (value: string, base: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setState(prev => ({ ...prev, copied: base }));
      setTimeout(() => {
        setState(prev => ({ ...prev, copied: null }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  const setPresetValue = useCallback((decimal: number) => {
    const converted = convertFromDecimal(decimal);
    setState(prev => ({
      ...prev,
      ...converted,
    }));
  }, [convertFromDecimal]);

  const presetValues = [
    { label: '255', value: 255, description: 'Max 8-bit' },
    { label: '1024', value: 1024, description: '2^10' },
    { label: '2048', value: 2048, description: '2^11' },
    { label: '4096', value: 4096, description: '2^12' },
    { label: '65535', value: 65535, description: 'Max 16-bit' },
    { label: '1000000', value: 1000000, description: 'One Million' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Number Base Converter</h2>
        <p className="text-slate-300">Convert between binary, octal, decimal, and hexadecimal</p>
      </div>

      {/* Preset Values */}
      <div className="bg-slate-800/30 rounded-xl p-4">
        <h3 className="text-white font-medium mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {presetValues.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setPresetValue(preset.value)}
              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg p-3 transition-colors text-center"
            >
              <div className="font-medium">{preset.label}</div>
              <div className="text-xs text-purple-400">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Base Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          label="Decimal (Base 10)"
          value={state.decimal}
          base="decimal"
          placeholder="Enter decimal number"
          description="Standard number system (0-9)"
          copied={state.copied}
          onInputChange={handleInputChange}
          onCopy={copyToClipboard}
        />
        
        <BaseInput
          label="Binary (Base 2)"
          value={state.binary}
          base="binary"
          placeholder="Enter binary number"
          description="Computer native (0, 1)"
          copied={state.copied}
          onInputChange={handleInputChange}
          onCopy={copyToClipboard}
        />
        
        <BaseInput
          label="Octal (Base 8)"
          value={state.octal}
          base="octal"
          placeholder="Enter octal number"
          description="Legacy system (0-7)"
          copied={state.copied}
          onInputChange={handleInputChange}
          onCopy={copyToClipboard}
        />
        
        <BaseInput
          label="Hexadecimal (Base 16)"
          value={state.hexadecimal}
          base="hexadecimal"
          placeholder="Enter hex number"
          description="Programming common (0-9, A-F)"
          copied={state.copied}
          onInputChange={handleInputChange}
          onCopy={copyToClipboard}
        />
      </div>

      {/* Information Panel */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6">
        <h3 className="text-white font-medium text-lg mb-4">Number System Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-blue-400 font-medium">Binary</div>
            <div className="text-slate-300">Base 2</div>
            <div className="text-slate-400">Used in digital circuits</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-medium">Octal</div>
            <div className="text-slate-300">Base 8</div>
            <div className="text-slate-400">Legacy computing</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-medium">Decimal</div>
            <div className="text-slate-300">Base 10</div>
            <div className="text-slate-400">Human standard</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-medium">Hexadecimal</div>
            <div className="text-slate-300">Base 16</div>
            <div className="text-slate-400">Programming & colors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseConverter;