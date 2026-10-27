import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBytes, sanitizePath, calculateBatteryRemainingMinutes, filterItemsBySearch } from './system';

test('formatBytes formats file sizes correctly', () => {
  assert.equal(formatBytes(0), '0 Bytes');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024 * 5), '5 MB');
  assert.equal(formatBytes(1024 * 1024 * 1024 * 2.5), '2.5 GB');
});

test('sanitizePath normalizes folder paths', () => {
  assert.equal(sanitizePath('///Documents//Projects/'), '/Documents/Projects');
  assert.equal(sanitizePath('/'), '/');
});

test('calculateBatteryRemainingMinutes handles charging and discharge', () => {
  // Charging 80% with RapidCharge
  const minCharging = calculateBatteryRemainingMinutes(80, true, true);
  assert.ok(minCharging > 0 && minCharging <= 20);

  // Discharging at 50%
  const minDischarge = calculateBatteryRemainingMinutes(50, false, false);
  assert.equal(minDischarge, 200);
});

test('filterItemsBySearch filters across fields', () => {
  const list = [
    { id: '1', title: 'ThinkPad Specs', content: 'Intel i7 32GB RAM' },
    { id: '2', title: 'Shopping List', content: 'Apples, milk, coffee' },
  ];
  const res = filterItemsBySearch(list, 'thinkpad');
  assert.equal(res.length, 1);
  assert.equal(res[0].id, '1');

  const res2 = filterItemsBySearch(list, 'coffee');
  assert.equal(res2.length, 1);
  assert.equal(res2[0].id, '2');
});
