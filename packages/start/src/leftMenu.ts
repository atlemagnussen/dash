import { LitElement, PropertyValues, css, html } from "lit"
import { customElement } from "lit/decorators.js"
import { emitUrlEvent } from "./stores/events.js"

@customElement('left-menu')
export class HtmlApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--wa-color-surface-raised);
      color: var(--wa-color-text-normal);
    }
  `

  linkClicked = (e: any) => {
    e.preventDefault()
    const currentTarget = e.currentTarget as HTMLAnchorElement
    const target = e.target as HTMLElement
    const href = currentTarget.href
    if (!href)
      return
    
    if (target.nodeName == "A") {
      emitUrlEvent(href)
    } else {
      window.open(href, '_blank')
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    const anchors = this.renderRoot.querySelectorAll("a")
    anchors.forEach(anchor => {
      anchor.addEventListener("click", this.linkClicked)
    })
  }

  render() {
    return html`
      <h2>Menu</h2>

      <p>
        <a href="Login">Login page</a>
      </p>
      <p title="Radarr (movies)">
        <a href="https://radarr.logout.work">
          Radarr
          <wa-button variant="neutral" appearance="outlined" size="small">
            <wa-icon name="up-right-from-square"></wa-icon>
          </wa-button>
        </a>
      </p>
      <p title="Sonarr (series)">
        <a href="https://sonarr.logout.work">
          Sonarr
          <wa-button variant="neutral" appearance="outlined" size="small">
            <wa-icon name="up-right-from-square"></wa-icon>
          </wa-button>
        </a>
      </p>
      <p title="Prowlarr (indexes)">
        <a href="https://prowlarr.logout.work">
          Prowlarr
          <wa-button variant="neutral" appearance="outlined" size="small">
            <wa-icon name="up-right-from-square"></wa-icon>
          </wa-button>
        </a>
      </p>
      <p>
        <a href="https://deluge.logout.work">
          Deluge
          <wa-button variant="neutral" appearance="outlined" size="small">
            <wa-icon name="up-right-from-square"></wa-icon>
          </wa-button>
        </a>
      </p>
      <p>
        <a href="https://jelly.logout.work">
          Jellyfin
          <wa-button variant="neutral" appearance="outlined" size="small">
            <wa-icon name="up-right-from-square"></wa-icon>
          </wa-button>
        </a>
      </p>
    `
  }
}