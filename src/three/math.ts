export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function range(value: number, start: number, end: number) {
  return clamp01((value - start) / (end - start))
}

export function smooth(value: number) {
  const t = clamp01(value)
  return t * t * (3 - 2 * t)
}

export function pulse(value: number, start: number, peak: number, end: number) {
  if (value <= peak) return smooth(range(value, start, peak))
  return 1 - smooth(range(value, peak, end))
}

export function sample(value: number, keyframes: ReadonlyArray<readonly [number, number]>) {
  if (value <= keyframes[0][0]) return keyframes[0][1]
  const last = keyframes[keyframes.length - 1]
  if (value >= last[0]) return last[1]

  for (let i = 0; i < keyframes.length - 1; i += 1) {
    const current = keyframes[i]
    const next = keyframes[i + 1]
    if (value >= current[0] && value <= next[0]) {
      const t = smooth(range(value, current[0], next[0]))
      return current[1] + (next[1] - current[1]) * t
    }
  }

  return last[1]
}
