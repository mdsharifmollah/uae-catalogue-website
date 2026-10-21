let idle: Promise<void> | undefined

/**
 * Resolves once the page has fully loaded and the main thread is idle, so
 * non-critical scripts never compete with the first paint. Shared by every
 * caller; resolves immediately after the first time.
 */
export const whenIdle = (): Promise<void> => {
  idle ??= new Promise<void>((resolve) => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
    }
    const start = () => {
      if (w.requestIdleCallback) w.requestIdleCallback(() => resolve(), { timeout: 1500 })
      else window.setTimeout(resolve, 200)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
  })
  return idle
}
