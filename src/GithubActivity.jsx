import { useEffect, useState } from 'react'
import snapshot from './data/github-snapshot.json'
import { person } from './data/content.js'
import { loadGithubActivity } from './github/load.js'
import { describeActivity, formatCount, formatDay, formatFetchedAt, mergeActivity } from './github/model.js'

const login = person.github.replace(/\/$/, '').split('/').pop()

function dayLevel(day) {
  const level = Number(day.level)
  if (level >= 0 && level <= 4) return level
  return day.count > 0 ? 1 : 0
}

export default function GithubActivity() {
  const [activity, setActivity] = useState(snapshot)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    loadGithubActivity(login, { signal: controller.signal })
      .then((fresh) => {
        setActivity(mergeActivity(snapshot, fresh))
        setLive(true)
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return
        setLive(false)
      })
    return () => controller.abort()
  }, [])

  const view = describeActivity(activity)
  if (!view) return null

  const printed = formatFetchedAt(activity.fetchedAt)
  const best = view.best
    ? ` Best day: ${formatCount(view.best.count)} contributions, ${formatDay(view.best.date)}.`
    : ''

  return (
    <>
      <h2>GitHub</h2>
      <div className="github-sheet">
        <div className="github-copy">
          <p className="github-dateline">
            {person.name} on GitHub
            <span className="sep"> · </span>
            {view.rangeLabel}
          </p>
          <p className="github-hero-value">
            {formatCount(activity.mergedPullRequests, activity.mergedPullRequestsCapped)}
          </p>
          <p className="github-hero-label">pull requests merged</p>
          <div className="github-metrics">
            <p>
              <strong>{formatCount(activity.commits, activity.commitsCapped)}</strong>
              <span>commits</span>
            </p>
            <p>
              <strong>{formatCount(view.streak.value)}</strong>
              <span>{view.streak.label}</span>
            </p>
            <p>
              <strong>{formatCount(activity.repos)}</strong>
              <span>public repos</span>
            </p>
          </div>
        </div>
        <figure className="hero-plate github-plate">
          <img src={person.profileImage} alt="" width={800} height={800} />
          <figcaption>Plate 02 · Portrait</figcaption>
        </figure>
      </div>

      <div className="github-cal" aria-hidden="true">
        <span />
        <div className="github-months">
          {view.monthLabels.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
        <div className="github-wdays">
          <span />
          <span>Mon</span>
          <span />
          <span>Wed</span>
          <span />
          <span>Fri</span>
          <span />
        </div>
        <div className="github-weeks">
          {view.weeks.map((week, weekIndex) => (
            <div className="github-week" key={weekIndex}>
              {week.map((day, dayIndex) =>
                day ? (
                  <span
                    key={day.date}
                    className={`github-day lvl-${dayLevel(day)}`}
                    title={`${formatDay(day.date)} · ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`}
                  />
                ) : (
                  <span key={`pad-${weekIndex}-${dayIndex}`} className="github-day pad" />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="github-note">
        One square a day, {view.rangeLabel}. {formatCount(view.total)} public contributions — commits,
        pull requests, reviews, and issues.{best} This plate counts public repositories. Work at Tesco,
        Rippling, and Groww stays in private ones.
      </p>
      <p className="github-status">
        {live ? 'Live from GitHub' : `Last printed ${printed}`}
        <span className="sep"> · </span>
        <a className="press-link" href={person.github} target="_blank" rel="noreferrer">
          View profile
        </a>
      </p>
    </>
  )
}
