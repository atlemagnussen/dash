import {LitElement, html, css} from "lit"
import {customElement, query} from "lit/decorators.js"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"

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

        @position-try --custom-left {
            position-area: left;
            margin: 0 10px 0 -300px;
        }

        @position-try --custom-bottom {
            top: anchor(bottom);
            justify-self: anchor-center;
            margin: 10px 0 0 0;
            position-area: none;
        }

        @position-try --custom-right {
            left: calc(anchor(right) + 10px);
            align-self: anchor-center;
            width: 100px;
            position-area: none;
        }

        @position-try --custom-bottom-right {
            position-area: bottom right;
            margin: 10px 0 0 10px;
        }
        div#menu-popup {
            position: fixed;
            border-radius: 5px;
            margin: 0;
            position-anchor: --anchor-button;
            inset-area: right;
            /* top: anchor(bottom);
            left: anchor(left); */
            /* position-try-options: flip-block, flip-inline, flip-block flip-inline; */
            position-try-fallbacks:
                --custom-left, --custom-bottom,
                --custom-right, --custom-bottom-right;
            /* justify-self: anchor-center; */
        }
        ::backdrop {
            /* backdrop-filter: invert(.8); */
            /* backdrop-filter: grayscale(1); */
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
                    <fa-icon .icon=${faEllipsisVertical}>
                    </fa-icon>
                </slot>
            </button>
            
            <div id="menu-popup" popover>
                <slot name="content">no content</slot>
            </div>
        `
    }
}
