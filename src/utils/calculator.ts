/**
 * Pure calculator logic for KRIX Calculator
 */

export function evaluateExpression(expr: string): number {
  // Replace symbols
  const clean = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, `${Math.PI}`)
    .replace(/e/g, `${Math.E}`);

  // Safe evaluation of mathematical tokens
  // Allow only numbers, operators, parens, decimal, spaces
  if (!/^[0-9+\-*/().\s^%eE]+$/.test(clean)) {
    throw new Error('Invalid mathematical expression');
  }

  // Handle power operator ^ -> **
  const powerReplaced = clean.replace(/\^/g, '**');

  // Evaluate safely with Function
  const result = Function(`'use strict'; return (${powerReplaced})`)();
  if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
    throw new Error('Evaluation error');
  }
  return Number(result.toFixed(10)) / 1; // strips trailing float rounding
}

export function calculateScientificFunction(func: string, val: number): number {
  switch (func) {
    case 'sin':
      return Math.sin(val);
    case 'cos':
      return Math.cos(val);
    case 'tan':
      return Math.tan(val);
    case 'sqrt':
      if (val < 0) throw new Error('Square root of negative number');
      return Math.sqrt(val);
    case 'ln':
      if (val <= 0) throw new Error('Logarithm of non-positive number');
      return Math.log(val);
    case 'log10':
      if (val <= 0) throw new Error('Logarithm of non-positive number');
      return Math.log10(val);
    case 'factorial':
      if (val < 0 || !Number.isInteger(val)) throw new Error('Factorial requires non-negative integer');
      if (val > 170) return Infinity;
      let res = 1;
      for (let i = 2; i <= val; i++) res *= i;
      return res;
    case 'square':
      return val * val;
    case 'cube':
      return val * val * val;
    case 'inverse':
      if (val === 0) throw new Error('Division by zero');
      return 1 / val;
    default:
      return val;
  }
}
