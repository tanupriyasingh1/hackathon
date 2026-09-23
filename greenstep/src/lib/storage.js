const KEY = 'greenstep.v1'

export function loadState(fallback) {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return { ...fallback, ...parsed }
  } catch {
    return fallback
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage may be unavailable (private mode); the app still works in memory */
  }
}
