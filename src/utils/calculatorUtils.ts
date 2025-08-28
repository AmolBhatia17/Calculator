// Mathematical constants
const CONSTANTS = {
  π: Math.PI,
  e: Math.E,
};

// Convert degrees to radians
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

// Convert radians to degrees
const toDegrees = (radians: number): number => radians * (180 / Math.PI);

// Format number for display
export const formatNumber = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) {
    return 'Error';
  }
  
  // Handle very large or very small numbers with scientific notation
  if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6);
  }
  
  // Round to avoid floating point precision issues
  const rounded = Math.round(num * 1e10) / 1e10;
  
  // Format with appropriate decimal places
  if (Number.isInteger(rounded)) {
    return rounded.toString();
  }
  
  return rounded.toString();
};

// Evaluate mathematical expressions
export const evaluateExpression = (expression: string, angleMode: 'deg' | 'rad'): number => {
  if (!expression.trim()) {
    return 0;
  }

  // Replace constants
  let processedExpression = expression;
  Object.entries(CONSTANTS).forEach(([constant, value]) => {
    processedExpression = processedExpression.replace(new RegExp(constant, 'g'), value.toString());
  });

  // Handle trigonometric functions
  const trigFunctions = {
    sin: (x: number) => angleMode === 'deg' ? Math.sin(toRadians(x)) : Math.sin(x),
    cos: (x: number) => angleMode === 'deg' ? Math.cos(toRadians(x)) : Math.cos(x),
    tan: (x: number) => angleMode === 'deg' ? Math.tan(toRadians(x)) : Math.tan(x),
  };

  // Handle mathematical functions
  const mathFunctions = {
    sqrt: Math.sqrt,
    log: Math.log10,
    ln: Math.log,
    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    factorial: (n: number) => factorial(n),
    combination: (n: number, r: number) => combination(n, r),
    permutation: (n: number, r: number) => permutation(n, r),
  };

  // Create a safe evaluation context
  const context = {
    ...mathFunctions,
    pow: Math.pow,
    exp: Math.exp,
  };

  try {
    // Replace function calls with context function calls
    Object.keys(context).forEach(func => {
      if (func === 'combination' || func === 'permutation') {
        // Handle two-parameter functions like nCr(5,2) or nPr(5,2)
        const regex = new RegExp(`${func}\\(([^,]+),([^)]+)\\)`, 'g');
        processedExpression = processedExpression.replace(regex, (match, arg1, arg2) => {
          const evaluatedArg1 = evaluateExpression(arg1.trim(), angleMode);
          const evaluatedArg2 = evaluateExpression(arg2.trim(), angleMode);
          return context[func as keyof typeof context](evaluatedArg1, evaluatedArg2).toString();
        });
      } else {
        // Handle single-parameter functions
        const regex = new RegExp(`${func}\\(([^)]+)\\)`, 'g');
        processedExpression = processedExpression.replace(regex, (match, args) => {
          const evaluatedArgs = evaluateExpression(args, angleMode);
          return context[func as keyof typeof context](evaluatedArgs).toString();
        });
      }
    });

    // Handle power operator
    processedExpression = processedExpression.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 
      (match, base, exponent) => Math.pow(parseFloat(base), parseFloat(exponent)).toString()
    );

    // Replace × with * for multiplication
    processedExpression = processedExpression.replace(/×/g, '*');
    processedExpression = processedExpression.replace(/÷/g, '/');

    // Safely evaluate the mathematical expression
    const result = Function(`"use strict"; return (${processedExpression})`)();
    
    if (typeof result !== 'number') {
      throw new Error('Invalid result type');
    }

    return result;
  } catch (error) {
    throw new Error('Invalid expression');
  }
};

// Factorial function
export const factorial = (n: number): number => {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial is only defined for non-negative integers');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
};

// Combination function
export const combination = (n: number, r: number): number => {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('Invalid combination parameters');
  }
  return factorial(n) / (factorial(r) * factorial(n - r));
};

// Permutation function
export const permutation = (n: number, r: number): number => {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('Invalid permutation parameters');
  }
  return combination(n,r)*factorial(r);
}