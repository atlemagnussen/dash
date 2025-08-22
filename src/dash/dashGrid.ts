import { LitElement, css, html, nothing } from "lit"
import { customElement, property, query, state } from "lit/decorators.js"
import { GridAppConf, GridApp } from "."
import { styleMap } from "lit/directives/style-map.js"
import { classMap } from "lit/directives/class-map.js"
import "./gridApp"

@customElement('dash-grid')
export class DashGrid extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            --dash-lines-color: #111;
            --dash-placeholder-border: 4px dotted red;
        }
        .flex-body {
            flex-grow: 1;
            /* grid-template-columns: repeat(20, 1fr);
            grid-template-rows: repeat(20, 1fr); */
            display: grid;
            gap: 1px;
            &.edit-mode {
                /* background-color: grey; */
                background-size: calc(100%/var(--dash-cols, 10)) calc(100%/var(--dash-rows, 10));
                background-image:
                    linear-gradient(to right, var(--dash-lines-color) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--dash-lines-color) 1px, transparent 1px);
                border-bottom: 1px var(--dash-lines-color) solid;
                border-right: 1px var(--dash-lines-color) solid;
            }

            div {
                font-size: 1.5rem;
                background: #401571;
                border: 1px solid #FFF;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                aspect-ratio: 1/1;
                transition: background cubic-bezier(0.215, 0.610, 0.355, 1) linear;
                cursor: pointer;
                &:hover {
                    background-color: #8745d3;
                }
                &.dragging {
                    opacity: 0.5;
                }
            }
            .placeholder {
                background: transparent;
                border: var(--dash-placeholder-border);
            }
            .app {
                background: rebeccapurple;
            }
            grid-app {
                aspect-ratio: 1/1;
            }
        }
    `

    @property({attribute: false})
    apps: GridAppConf[] = []

    @property({attribute: true, type: Number})
    rows = 10

    @property({attribute: true, type: Number})
    cols = 10

    @property({attribute: true, type: Boolean})
    edit = false

    @state()
    placeholder: GridApp | null = null

    calcRowCol(e: DragEvent): GridApp {
        let ga: GridApp = { id: "placeholder", x: 0, y: 0, w: 1, h: 1 }

        if (!this.flexBody)
            return ga

        const target = e.target as HTMLDivElement
        const id = target.id

        const conf = this.apps.find(x => x.id == id)
        if (!conf)
            return ga
        
        const b = this.flexBody.getBoundingClientRect()

        const widthPerBlock = b.width / this.cols
        const colD = e.x - b.left
        const x = Math.ceil(colD / widthPerBlock)

        const heightPerBlock = b.height / this.rows
        const rowD = e.y - b.top
        const y = Math.ceil(rowD / heightPerBlock)

        const {w,h} = conf
        ga = { id, x, y, w, h }

        return ga
    }

    updateCol(id: string, a: GridApp) {
        const rc = this.apps.find(x => x.id == id)
        if (rc) {
            rc.x = a.x
            rc.y = a.y
            this.requestUpdate()
        }
    }

    @query(".flex-body")
    flexBody: HTMLDivElement | undefined
    firstUpdated() {
        if (!this.flexBody)
            return
        this.setupDnd()
    }

    setupDnd() {
        if (!this.flexBody)
            return

        this.flexBody.addEventListener("dragover", (e) => this.dragOver(e))
    }

    dragStart(evt: DragEvent) {
        let id = "0"
        
        const target = evt.target as HTMLDivElement
        if (target)
            id = target.id

        if (evt.dataTransfer) {
            evt.dataTransfer.setData("text", id)
            evt.dataTransfer.effectAllowed = "move"
        }
            
    }
    dragging(evt: DragEvent) {
        const target = evt.target as HTMLElement
        target.classList.add("dragging")
        const gc = this.calcRowCol(evt)
        this.placeholder = gc
        
    }
    dragEnd (e: DragEvent) {
        const target = e.target as HTMLElement
        target.classList.remove("dragging")
        this.placeholder = null

        if (!this.flexBody)
            return
        
        const gc = this.calcRowCol(e)
        this.updateCol(target.id, gc)
    }

    dragEnter(evt: DragEvent) {
        const target = evt.target
        console.log(target)
    }
    onDrop(evt: DragEvent) {
        console.log("onDrop", evt)
        evt.preventDefault()
    }
    dragOver(evt: DragEvent) {
        evt.preventDefault()
    }
    appResized(e: CustomEvent, id: string) {
        console.log(id)
        const box = e.detail as DOMRectReadOnly
        if (!box)
            return

        const conf = this.apps.find(x => x.id == id)
        if (!conf)
            return

        if (!this.flexBody)
            return

        const b = this.flexBody.getBoundingClientRect()
        const widthCell= b.width / this.cols
        const heightCell = b.height / this.cols
        conf.w = Math.round(box.width / widthCell)
        conf.h = Math.round(box.height / heightCell)
        this.dispatchEvent(new CustomEvent("app-config-changed", {
            bubbles: false, composed: true, detail: conf
        }))
        this.requestUpdate()
    }

    render() {
        const styles = {
            "--dash-rows": this.rows,
            "--dash-cols": this.cols,
            "grid-template-rows": `repeat(var(--dash-rows), 1fr)`,
            "grid-template-columns": `repeat(var(--dash-cols), 1fr)`
        }
        const classes = { "flex-body": true, "edit-mode": this.edit }
        return html`
            <section class=${classMap(classes)} style=${styleMap(styles)}>
                ${this.placeholder ? html`
                    <grid-app class="placeholder" id="placeholder"
                        x=${this.placeholder.x} y=${this.placeholder.y} w=${this.placeholder.w} h=${this.placeholder.h}>
                        <span></span>
                    </grid-app>
                ` : nothing}
                ${this.apps.map(a => 
                    html`
                        <grid-app class="app" x=${a.x} y=${a.y} w=${a.w} h=${a.h}
                            .edit=${this.edit}
                            id=${a.id}
                            draggable="${this.edit}"
                            @dragstart=${(e:DragEvent) => this.dragStart(e)}
                            @drag=${(e:DragEvent) => this.dragging(e)}
                            @dragend=${(e:DragEvent) => this.dragEnd(e)}
                            @gridappresized=${(e: CustomEvent) => this.appResized(e, a.id)}
                            @config-changed=${(e: CustomEvent) => this.configChanged(e, a.id)}
                        >
                            <app-resolver .appconf=${a}></app-resolver>
                        </grid-app>
                    `
                )}
            </section>
        `
    }
    configChanged(e: CustomEvent, id: string) {
        const appConf = this.apps.find(a => a.id == id)
        if (appConf) {
            const conf = e.detail
            appConf.config = conf
            this.dispatchEvent(new CustomEvent("app-config-changed", {
                bubbles: false, composed: true, detail: appConf
            }))
        }
    }
}