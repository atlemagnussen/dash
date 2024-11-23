import { LitElement, css, html } from "lit"
import { customElement, property, query } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"

@customElement('html-app')
export class HtmlApp extends LitElement {
    static styles = css`
        :host {
            display: block;
            position: relative;
        }
        textarea {
            width: 100%;
            height: 100%;
        }
    `

    @property({attribute: false})
    config = ""

    @property({attribute: "edit-mode", type: Boolean})
    editMode = false

    @query("textarea")
    textAreaEl: HTMLTextAreaElement | undefined

    change() {
        if (this.textAreaEl) {
            let content = this.textAreaEl.value
            content = content.replace(/<\!--.*?-->/g, "");
            content = content.trim()
            this.dispatchEvent(new CustomEvent("config-changed", {
                bubbles: true, composed: true, detail: content
            }))
        }
        
    }
    render() {
        return html`
            ${this.editMode ? html`
                <textarea @change=${() => this.change()}>${this.config}</textarea>
            `: html`
                ${unsafeHTML(this.config)}
            `}
        `
    }
}