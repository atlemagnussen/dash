import { LitElement, PropertyValues, css, html } from "lit"
import { customElement, property, query, state } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import { styleMap } from "lit/directives/style-map.js"
import { classMap } from "lit/directives/class-map.js"

@customElement('grid-app')
export class GridApp extends LitElement {
    static styles = css`
        :host {
            display: block;
            position: relative;
        }
        div.resizer {
            position: absolute;
            top: 0;
            left: 0;
            overflow: scroll;
            border: 1px solid black;
            resize: both;
            &.active {
                background-color: rebeccapurple;
                opacity: 0.4;
            }
        }
    `

    observer: ResizeObserver | undefined

    @property({attribute: true, type: Boolean})
    edit = false

    @property({attribute: false})
    content = "<span></span>"

    @property({attribute: true, type: Number})
    x = 1

    @property({attribute: true, type: Number})
    y = 1

    @property({attribute: true, type: Number})
    w = 1

    @property({attribute: true, type: Number})
    h = 1

    setGridArea() {
        const rowEnd = this.y + this.h
        const colEnd = this.x + this.w
        this.style.gridArea = `${this.y} / ${this.x} / ${rowEnd} / ${colEnd}`
    }

    @state()
    styles = {
        width: "0",
        height: "0"
    }
    
    box: DOMRect | undefined
    
    boxNew: DOMRectReadOnly | undefined

    getStyle() {
        if (!this.box)
            this.box = this.getBoundingClientRect()
        this.styles = {
            width: this.box.width + "px",
            height: this.box.height + "px"
        }
    }
    @query(".resizer")
    resizerEl: HTMLDivElement | undefined

    onResize(e:any) {
        console.log(e)
    }
    
    observeResize() {
        if (!this.observer) {
            this.observer = new ResizeObserver((mutations) => {
                if (this.isResizing) {
                    this.boxNew = mutations[0].contentRect
                    console.log("resize")
                }
            })
        }
        
        if (!this.resizerEl)
            return
        this.observer.observe(this.resizerEl)
    }
    unobserve() {
        if (this.observer) {
            if (this.resizerEl)
                this.observer.unobserve(this.resizerEl)
            this.observer.disconnect()
        }
    }
    protected firstUpdated(_changedProperties: PropertyValues): void {
        if (this.edit)
            this.observeResize()
        this.getStyle()
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.unobserve()
    }
    @state()
    isResizing = false

    mouseDown() {
        this.isResizing = true
    }
    mouseUp() {
        this.isResizing = false
        if (!this.box || !this.boxNew)
            return

        if (this.box.height !== this.boxNew.height || this.box.width !== this.boxNew.width) {
            this.dispatchEvent(new CustomEvent("gridappresized", {
                bubbles: false,
                detail: this.boxNew
            }))
        }
        
        this.boxNew = undefined
    }

    render() {
        this.setGridArea()
        const classes = { "resizer": true, "active": this.isResizing}
        return html`
            ${this.edit ? html`
                <div class=${classMap(classes)} 
                style=${styleMap(this.styles)} 
                    @mousedown=${() => this.mouseDown()}
                    @mouseup=${() => this.mouseUp()}>
                </div>
            ` : html``}
            ${unsafeHTML(this.content)}
        `
    }
    updated(changedProps: PropertyValues) {
        if (changedProps) {
            if (changedProps.has("w") || changedProps.has("h")) {
                this.box = this.getBoundingClientRect()
                this.getStyle()
            }
            if (changedProps.has("edit")) {
                //const edit = changedProps.get("edit")
                if (this.edit)
                    this.observeResize()
                else
                    this.unobserve()
            }
        }
    }
}