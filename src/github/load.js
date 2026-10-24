/**
 * Public sources a static page can call itself. No token.
 *
 * - api.github.com allows browser CORS. Unauthenticated search is capped
 *   at 10 requests/minute per IP, and commit search stops at 1,000.
 * - The contribution calendar is not on the REST API. GraphQL needs a token,
 *   which cannot live in a public site. github-contributions-api publishes
 *   the same public calendar as JSON with CORS.
 * Private employer repositories are absent from both.
 */

const USERNAME = /^[A-Za-z0-9-]+$/

function headers() {
  const value = { Accept: 'application/vnd.github+json' }
  if (typeof window === 'undefined') value['User-Agent'] = 'aditya-portfolio'
  return value
}

async function getJson(url, fetchImpl, signal, { github = false } = {}) {
  const response = await fetchImpl(url, {
    signal,
    headers: github ? headers() : { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`${response.status} for ${url}`)
  }
  return response.json()
}

function readTotal(payload) {
  if (!payload || typeof payload.total_count !== 'number') return null
  return {
    count: payload.total_count,
    capped: payload.incomplete_results === true || payload.total_count >= 1000,
  }
}

export async function loadGithubActivity(login, { fetchImpl = globalThis.fetch, signal } = {}) {
  if (!USERNAME.test(login)) throw new Error('Unexpected GitHub login')

  const calendar = await getJson(
    `https://github-contributions-api.jogruber.de/v4/${login}?y=last`,
    fetchImpl,
    signal,
  )
  const contributions = (calendar.contributions ?? [])
    .filter((day) => typeof day.date === 'string')
    .map((day) => ({
      date: day.date,
      count: Number(day.count) || 0,
      level: Number(day.level) || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  if (!contributions.length) throw new Error('Contribution calendar was empty')

  const from = contributions[0].date
  const to = contributions[contributions.length - 1].date
  const prQuery = `author:${login} is:pr is:merged merged:${from}..${to}`
  const commitQuery = `author:${login} author-date:${from}..${to}`

  const [user, prs, commits] = await Promise.all([
    getJson(`https://api.github.com/users/${login}`, fetchImpl, signal, { github: true }).catch(
      () => null,
    ),
    getJson(
      `https://api.github.com/search/issues?q=${encodeURIComponent(prQuery)}&per_page=1`,
      fetchImpl,
      signal,
      { github: true },
    )
      .then(readTotal)
      .catch(() => null),
    getJson(
      `https://api.github.com/search/commits?q=${encodeURIComponent(commitQuery)}&per_page=1`,
      fetchImpl,
      signal,
      { github: true },
    )
      .then(readTotal)
      .catch(() => null),
  ])

  return {
    fetchedAt: new Date().toISOString(),
    login,
    repos: typeof user?.public_repos === 'number' ? user.public_repos : null,
    mergedPullRequests: prs?.count ?? null,
    mergedPullRequestsCapped: Boolean(prs?.capped),
    commits: commits?.count ?? null,
    commitsCapped: Boolean(commits?.capped),
    contributions,
  }
}
