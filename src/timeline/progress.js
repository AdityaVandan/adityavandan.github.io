/** Scroll-linked timeline math. Kept pure so the press can be tested without a browser. */

export function clamp01(value) {
  if (Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/**
 * How far the ink rule has been pulled along the spine.
 * 0 when the reading line is on the first mark, 1 when it reaches the last.
 */
export function ruleProgress(spineTop, spineHeight, readY) {
  if (!(spineHeight > 0)) return 1
  return clamp01((readY - spineTop) / spineHeight)
}

/**
 * 0 while a mark sits a full `lead` below the reading line,
 * 1 once that mark meets the line.
 */
export function stationPress(markMid, readY, lead) {
  if (!(lead > 0)) return 1
  return clamp01((readY + lead - markMid) / lead)
}

/** The station the reader has reached, sticking until the next one impresses. */
export function activeStation(presses, threshold = 0.55) {
  let active = 0
  for (let index = 0; index < presses.length; index += 1) {
    if (presses[index] >= threshold) active = index
  }
  return active
}
