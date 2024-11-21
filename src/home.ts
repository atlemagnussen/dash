import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('home-view')
export class HomeView extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      /* text-align: center; */
    }
  `
  render() {
    return html`
      <p>Home</p>
    `
  }
}
