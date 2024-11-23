import {LitElement, html, css} from "lit"
import {customElement, property, state} from "lit/decorators.js"

@customElement('fa-icon')
export class FontawesomeIcon extends LitElement {

    @state()
    declare private _viewBox: string

    @state()
    declare private  _path: string

    declare private _icon: any
    
    get icon(): any {
        return this._icon;
    }
    set icon(value: any) {
        this._icon = value
        this.extractIcon()
    }
    
    @property({attribute: true})
    declare counter: string

    constructor() {
        super()
        this._viewBox = "0 0 10 10"
        this._path = ""
        this.counter = ""
    }
    static styles = css`
        :host {
            display: inline-block;
            position: relative;
            margin: 0;
            padding: 0;
            width: var(--dash-icon-width, 1em);
            height: var(--dash-icon-height, 1em);
        }
        .fa-dl-icon {
            width: 100%;
            height: 100%;            
            overflow: visible;
            display: block;
            margin-bottom: var(--digilean-fa-icon-margin-bottom, 0);
        }
        span.badge {
            display: inline-block;
            position: absolute;
            top: -6px;
            right: -12px;
            width: calc(var(--digilean-fa-icon-width) * 0.8);
            height: calc(var(--digilean-fa-icon-width) * 0.8);
            line-height: calc(var(--digilean-fa-icon-width) * 0.8);
            font-family: "Roboto Mono", monospace;
            font-size: x-small;
            border-radius: 50%;
            text-align: center;
            background: var(--digilean-primary);
            color: var(--digilean-text-on-dark);
        }
    `

    extractIcon() {
        this._viewBox = `0 0 ${this._icon.icon[0]} ${this._icon.icon[1]}`
        this._path = this._icon.icon[4]
    }

    render() {
        
        return html`
            <svg aria-hidden="true"
                class="fa-dl-icon"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="${this._viewBox}"
            >
                <path fill="currentColor" d="${this._path}" />
            </svg>
            
            ${this.counter ? 
                html`<span class="badge">${this.counter}</span>` : ""
            }
        `
    }
}