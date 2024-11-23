import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"

@customElement('html-app')
export class HtmlApp extends LitElement {
    static styles = css`
        :host {
            display: block;
            position: relative;
        }
    `

    @property({attribute: false})
    content = ""

    render() {
        return html`
            ${unsafeHTML(this.content)}
        `
    }
}