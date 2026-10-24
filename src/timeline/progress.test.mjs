import assert from 'node:assert/strict'
import test from 'node:test'
import { activeStation, clamp01, ruleProgress, stationPress } from './progress.js'

test('clamp01 pins to the unit interval', () => {
  assert.equal(clamp01(-0.2), 0)
  assert.equal(clamp01(0.4), 0.4)
  assert.equal(clamp01(2), 1)
  assert.equal(clamp01(Number.NaN), 0)
})

test('the ink rule runs from the first mark to the last', () => {
  const first = 200
  const last = 800
  const height = last - first

  assert.equal(ruleProgress(first, height, 100), 0)
  assert.equal(ruleProgress(first, height, first), 0)
  assert.equal(ruleProgress(first, height, 500), 0.5)
  assert.equal(ruleProgress(first, height, last), 1)
  assert.equal(ruleProgress(first, height, 900), 1)
  assert.equal(ruleProgress(first, 0, 500), 1)
})

test('a station finishes impressing as the reading line reaches its mark', () => {
  const readY = 400
  const lead = 200

  assert.equal(stationPress(700, readY, lead), 0)
  assert.equal(stationPress(readY + lead, readY, lead), 0)
  assert.equal(stationPress(500, readY, lead), 0.5)
  assert.equal(stationPress(readY, readY, lead), 1)
  assert.equal(stationPress(300, readY, lead), 1)
  assert.equal(stationPress(500, readY, 0), 1)
})

test('ink arrives at a mark as that station locks in', () => {
  const first = 400
  const second = 700
  const last = 1100
  const readY = second
  const lead = 220

  assert.equal(ruleProgress(first, last - first, readY), (second - first) / (last - first))
  assert.equal(stationPress(second, readY, lead), 1)
  assert.ok(stationPress(last, readY, lead) < 1)
})

test('the running impression stays on the latest station past the threshold', () => {
  assert.equal(activeStation([0, 0, 0]), 0)
  assert.equal(activeStation([1, 0.2, 0]), 0)
  assert.equal(activeStation([1, 0.55, 0.1]), 1)
  assert.equal(activeStation([1, 1, 1, 0.9]), 3)
  assert.equal(activeStation([]), 0)
})
