export const eventBus = new EventTarget()

export function emitUrlEvent(url: string) {
  const urlEvent = new CustomEvent('url-changed', {
    composed: true, detail: { url }
  })
  eventBus.dispatchEvent(urlEvent)
}
