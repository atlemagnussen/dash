import { css, html, LitElement } from "lit"
import {customElement, property} from "lit/decorators.js"
import { eventBus } from "./stores/events.js"

@customElement("frame-loader")
export class FrameLoader extends LitElement {

    static styles = css`
        :host {
            display: block;
            height: 100%;
        }
        iframe {
            height: 100%;
            width: 100%;
        }
    `

    urlChanged = ((e: CustomEvent) => {
        const url = e.detail.url as string
        console.log("url changed", url)
        this.url = url
    }) as EventListener

    connectedCallback(): void {
        super.connectedCallback()

        eventBus.addEventListener("url-changed", this.urlChanged)
    }
    @property({attribute: false})
    url = ""

    render() {
        if (!this.url)
            return html`<p>No url provided</p>`
        return html`
            <iframe src="${this.url}" 
                frameborder="0" allow="clipboard-write; media-playback-while-not-visible 'none';"
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-top-navigation allow-forms allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-modals"
                allowfullscreen="true">
            </iframe>
        `
    }
}