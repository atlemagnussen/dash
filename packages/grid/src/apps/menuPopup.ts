import {LitElement, html, css} from "lit"
import {customElement, query} from "lit/decorators.js"

@customElement('menu-popup')
export class MenuPopup extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
            height: var(--dash-image-height, 1.5rem);
            width: var(--dash-image-width, 1rem);
            --dash-icon-width: 1rem;
            --dash-icon-height: 1rem;
        }
        
        button {
            background: var(--digilean-grey-transparent);
            border-radius: 50%;
            border: 1px solid white;
            color: inherit;
            cursor: pointer;
            height: 1.5rem;
            width: 1.5rem;
            outline: none;
            margin: 0;
            padding: 0;
            text-align: center;
            anchor-name: --anchor-button;
        }
        button:hover {
            background: grey;
        }
        div#menu-popup {
            position: fixed;
            border-radius: 5px;
            margin: 0;
            position-anchor: --anchor-button;
            top: anchor(bottom);
            left: anchor(left);
        }
        ::backdrop {
            backdrop-filter: blur(5px)
        }
    `
    @query("[popover]")
    popoverEl?: HTMLDivElement

    @query(`[popovertarget="menu-popup"`)
    buttonEl?: HTMLButtonElement

    close() {
        this.popoverEl?.hidePopover()
    }

    render() {
        return html`
            <button id="button" popovertarget="menu-popup" popovertargetaction="toggle">
                <slot name="button">
                    m
                </slot>
            </button>
            
            <div id="menu-popup" popover>
                <slot name="content">no content</slot>
            </div>
        `
    }
}
