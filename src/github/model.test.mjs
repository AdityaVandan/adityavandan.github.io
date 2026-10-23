import assert from 'node:assert/strict'
import test from 'node:test'
import {
  bestDay,
  currentStreak,
  describeActivity,
  formatCount,
  formatRange,
  longestStreak,
  mergeActivity,
  monthLabels,
  toWeeks,
} from './model.js'

const days = [
  { date: '2026-03-21', count: 1, level: 1 },
  { date: '2026-03-22', count: 2, level: 2 },
  { date: '2026-03-23', count: 0, level: 0 },
  { date: '2026-03-24', count: 4, level: 3 },
  { date: '2026-03-25', count: 4, level: 3 },
  { date: '2026-03-26', count: 1, level: 1 },
]

test('longest streak ignores the gap', () => {
  assert.deepEqual(longestStreak(days), {
    days: 3,
    start: '2026-03-24',
    end: '2026-03-26',
  })
})

test('current streak survives an unfinished last day and stops after a gap', () => {
  assert.equal(currentStreak(days).days, 3)
  assert.equal(
    currentStreak([...days, { date: '2026-03-27', count: 0, level: 0 }]).days,
    3,
  )
  assert.equal(
    currentStreak([
      ...days,
      { date: '2026-03-27', count: 0, level: 0 },
      { date: '2026-03-28', count: 0, level: 0 },
    ]).days,
    0,
  )
})

test('best day prefers the later tie', () => {
  assert.equal(bestDay(days).date, '2026-03-25')
})

test('weeks start on Sunday and month labels leave room', () => {
  const march = []
  for (let day = 1; day <= 40; day += 1) {
    const date = new Date(Date.UTC(2026, 2, day)).toISOString().slice(0, 10)
    march.push({ date, count: 1, level: 1 })
  }
  assert.equal(toWeeks([{ date: '2026-03-23', count: 1, level: 1 }])[0][0], null)
  assert.equal(toWeeks([{ date: '2026-03-22', count: 1, level: 1 }])[0][0].date, '2026-03-22')
  const labels = monthLabels(toWeeks(march))
  assert.ok(labels.includes('Mar'))
  assert.ok(labels.includes('Apr'))
  assert.ok(labels.indexOf('Apr') - labels.indexOf('Mar') >= 3)
})

test('range drops a repeated year and counts cap at the search ceiling', () => {
  assert.equal(formatRange('2026-08-16', '2026-10-20'), '16 Aug – 20 Oct 2026')
  assert.equal(formatRange('2025-10-19', '2026-10-23'), '19 Oct 2025 – 23 Oct 2026')
  assert.equal(formatCount(1000, true), '1,000+')
  assert.equal(formatCount(null), '—')
})

test('live gaps keep the printed snapshot', () => {
  const snapshot = {
    fetchedAt: '2026-10-01T00:00:00.000Z',
    login: 'AdityaVandan',
    repos: 32,
    mergedPullRequests: 35,
    mergedPullRequestsCapped: false,
    commits: 67,
    commitsCapped: false,
    contributions: days,
  }
  const merged = mergeActivity(snapshot, {
    fetchedAt: '2026-10-23T12:00:00.000Z',
    login: 'AdityaVandan',
    repos: null,
    mergedPullRequests: null,
    commits: 70,
    commitsCapped: false,
    contributions: [],
  })
  assert.equal(merged.repos, 32)
  assert.equal(merged.mergedPullRequests, 35)
  assert.equal(merged.commits, 70)
  assert.equal(merged.contributions, days)
  assert.equal(describeActivity(merged).streak.label, 'days in a row')
  assert.equal(describeActivity(merged).streak.value, 3)
})
