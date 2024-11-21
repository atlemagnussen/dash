import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import {GridAppConf, getTimestampId} from "./dash"

@customElement('home-view')
export class HomeView extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0;
            padding: 0;
            text-align: center;
            height: 100%;
        }
        header {
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;
        }
        dash-grid {
            width: 600px;
            flex-basis: 600px;
            flex-grow: 1;
            --gs-lines-color: var(--primary-color);
        }
    `

    gridApps: GridAppConf[] = [
        {
            id: getTimestampId(),
            content: "test1",
            x: 1, y: 1, w: 2, h: 2
        },
        {
            id: getTimestampId(),
            content: "test2",
            x: 6, y: 2, w: 2, h: 2
        }, {
            id: getTimestampId(),
            content: "tes3",
            x: 11, y: 3, w: 2, h: 2
        }
    ]


    add() {
        this.gridApps.push({
            id: getTimestampId(),
            content: "test",
            x: 1, y: 1, w: 2, h: 2
        })
        this.requestUpdate()
    }

    adminModeChange(e: Event) {
        const target = e.target as HTMLInputElement
        const adminMode = target.checked
        this.adminMode = adminMode
    }

    @state()
    adminMode = false

    render() {
        return html`
            <header>
                <h2>Grid</h2>
                <label for="adminmode">
                    Admin mode
                    <input id="adminmode" 
                        type="checkbox" .checked=${this.adminMode}
                        @change=${(e: Event) => this.adminModeChange(e)}></input>
                </label>
                
            </header>
            <dash-grid .apps=${this.gridApps} 
                rows="15" cols="15" 
                .edit=${this.adminMode}>
            </dash-grid>
        `
    }
}