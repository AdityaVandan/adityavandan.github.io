const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatCount(value, capped = false) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const text = Number(value).toLocaleString('en-US')
  return capped ? `${text}+` : text
}

export function formatDay(iso, { year = true } = {}) {
  const [y, m, d] = iso.split('-').map(Number)
  const body = `${d} ${MONTHS[m - 1]}`
  return year ? `${body} ${y}` : body
}

export function formatRange(start, end) {
  const sameYear = start.slice(0, 4) === end.slice(0, 4)
  return `${formatDay(start, { year: !sameYear })} – ${formatDay(end)}`
}

export function formatFetchedAt(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h12',
    timeZoneName: 'short',
  }).format(date)
}

function utcWeekday(iso) {
  return new Date(`${iso}T00:00:00Z`).getUTCDay()
}

export function toWeeks(days) {
  if (!days.length) return []
  const cells = [...Array(utcWeekday(days[0].date)).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    const slice = cells.slice(i, i + 7)
    while (slice.length < 7) slice.push(null)
    weeks.push(slice)
  }
  return weeks
}

export function monthLabels(weeks) {
  const labels = []
  let lastMonth = ''
  let lastIndex = -4
  weeks.forEach((week, index) => {
    const first = week.find((day) => day)
    const month = first ? first.date.slice(5, 7) : ''
    if (month && month !== lastMonth && index - lastIndex >= 2) {
      labels.push(MONTHS[Number(month) - 1])
      lastMonth = month
      lastIndex = index
    } else {
      labels.push('')
      if (month && month !== lastMonth) lastMonth = month
    }
  })
  return labels
}

export function longestStreak(days) {
  let best = 0
  let run = 0
  let bestStart = null
  let bestEnd = null
  let runStart = null
  for (const day of days) {
    if (day.count > 0) {
      if (run === 0) runStart = day.date
      run += 1
      if (run > best) {
        best = run
        bestStart = runStart
        bestEnd = day.date
      }
    } else {
      run = 0
      runStart = null
    }
  }
  return { days: best, start: bestStart, end: bestEnd }
}

export function currentStreak(days) {
  if (!days.length) return { days: 0, start: null, end: null }
  let index = days.length - 1
  if (days[index].count === 0) index -= 1
  if (index < 0 || days.length - 1 - index > 1) return { days: 0, start: null, end: null }

  let run = 0
  let start = days[index].date
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    if (days[cursor].count === 0) break
    run += 1
    start = days[cursor].date
  }
  return { days: run, start, end: days[index].date }
}

export function bestDay(days) {
  let best = null
  for (const day of days) {
    if (!best || day.count > best.count || (day.count === best.count && day.date > best.date)) {
      best = day
    }
  }
  if (!best || best.count === 0) return null
  return best
}

export function totalContributions(days) {
  return days.reduce((sum, day) => sum + day.count, 0)
}

export function mergeActivity(snapshot, live) {
  if (!live) return snapshot
  const contributions = live.contributions?.length ? live.contributions : snapshot.contributions
  return {
    fetchedAt: live.fetchedAt || snapshot.fetchedAt,
    login: live.login || snapshot.login,
    repos: live.repos ?? snapshot.repos,
    mergedPullRequests:
      live.mergedPullRequests ?? snapshot.mergedPullRequests,
    mergedPullRequestsCapped:
      live.mergedPullRequests == null
        ? Boolean(snapshot.mergedPullRequestsCapped)
        : Boolean(live.mergedPullRequestsCapped),
    commits: live.commits ?? snapshot.commits,
    commitsCapped:
      live.commits == null ? Boolean(snapshot.commitsCapped) : Boolean(live.commitsCapped),
    contributions,
  }
}

export function describeActivity(activity) {
  const days = [...(activity?.contributions ?? [])].sort((a, b) => a.date.localeCompare(b.date))
  if (!days.length) return null

  const longest = longestStreak(days)
  const current = currentStreak(days)
  const best = bestDay(days)
  const weeks = toWeeks(days)
  const streak =
    current.days > 0
      ? { value: current.days, label: current.days === 1 ? 'day in a row' : 'days in a row' }
      : { value: longest.days, label: 'longest streak' }

  return {
    days,
    weeks,
    monthLabels: monthLabels(weeks),
    rangeLabel: formatRange(days[0].date, days[days.length - 1].date),
    total: totalContributions(days),
    best,
    streak,
  }
}
