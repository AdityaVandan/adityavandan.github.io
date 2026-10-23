import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadGithubActivity } from '../src/github/load.js'

const target = join(dirname(fileURLToPath(import.meta.url)), '../src/data/github-snapshot.json')

try {
  const activity = await loadGithubActivity('AdityaVandan')
  writeFileSync(target, `${JSON.stringify(activity, null, 2)}\n`)
  console.log(
    `GitHub snapshot: ${activity.mergedPullRequests} merged PRs, ${activity.commits} commits, ${activity.repos} repos, ${activity.contributions.length} days`,
  )
} catch (error) {
  console.warn(`GitHub stats refresh skipped: ${error.message}`)
  process.exitCode = 1
}
