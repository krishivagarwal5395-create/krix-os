import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateExpression, calculateScientificFunction } from './calculator';

test('evaluateExpression calculates arithmetic correctly', () => {
  assert.equal(evaluateExpression('2 + 3 * 4'), 14);
  assert.equal(evaluateExpression('(10 - 4) / 2'), 3);
  assert.equal(evaluateExpression('2^3'), 8);
  assert.equal(evaluateExpression('10 % 3'), 1);
});

test('evaluateExpression handles float rounding', () => {
  assert.equal(evaluateExpression('0.1 + 0.2'), 0.3);
});

test('calculateScientificFunction performs math operations', () => {
  assert.equal(calculateScientificFunction('sqrt', 16), 4);
  assert.equal(calculateScientificFunction('square', 5), 25);
  assert.equal(calculateScientificFunction('factorial', 5), 120);
  assert.equal(calculateScientificFunction('inverse', 2), 0.5);
});
