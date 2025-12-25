import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('left-menu')
export class HtmlApp extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `
  render() {
    return html`
      <p>Menu</p>
    `
  }
}