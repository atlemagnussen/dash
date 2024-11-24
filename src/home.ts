import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { GridAppConf, getTimestampId } from "./dash"
import "./components/faIcon"
import "./apps"
import * as dataService from "./backend/dataService"
import { GridAppPageConf } from "./backend/dataService"

const pageId = "demopage"

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
            width: 100%;
            height: 100%;
        }
        header {
            position: absolute;
            top: 0;
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            padding: 0.5rem 1rem;
            /* menu-popup {
                margin: 0.5rem 0.7rem 0 0;
            } */
        }
        dash-grid {
            width: 100%;
            flex-basis: 600px;
            flex-grow: 1;
            --dash-lines-color: var(--primary-color);
        }
        nav ul {
            list-style-type: none;
        }
    `
    @state()
    gridApps: GridAppConf[] = []

    @state() 
    page: dataService.GridPage = { id: pageId, rows: 10, cols: 10, apps: []}

    async getAppsConf() {
        let page = await dataService.getPageConfig(pageId)
        if (!page) {
            page = {
                id: pageId,
                rows: 15, cols: 30, apps: []
            }
            await dataService.savePage(page)
        }
        this.page = page
        this.gridApps = this.page.apps
    }

    addApp() {
        const newApp = {
            id: getTimestampId(),
            pageId,
            app: "html-app",
            config: "test",
            x: 1, y: 1, w: 2, h: 2
        }
        dataService.saveAppConfig(newApp)
        this.gridApps.push(newApp)
        this.requestUpdate()
    }

    adminModeChange(e: Event) {
        const target = e.target as HTMLInputElement
        const adminMode = target.checked
        this.adminMode = adminMode
    }

    rowsChange(e: Event) {
        const target = e.target as HTMLInputElement
        const rows = parseInt(target.value)
        this.page.rows = rows
        dataService.savePage(this.page)
        this.requestUpdate()
    }
    colsChange(e: Event) {
        const target = e.target as HTMLInputElement
        const cols = parseInt(target.value)
        this.page.cols = cols
        dataService.savePage(this.page)
        this.requestUpdate()
    }
    connectedCallback(): void {
        super.connectedCallback()
        this.getAppsConf()
    }

    @state()
    adminMode = false

    render() {
        return html`
            <header>
                <menu-popup>
                    <nav slot="content">
                        <ul>
                            <li>
                                <label for="adminmode">
                                    Admin mode
                                    <input id="adminmode" 
                                        type="checkbox" .checked=${this.adminMode}
                                        @change=${(e: Event) => this.adminModeChange(e)}></input>
                                </label>
                            </li>
                            ${this.page ? html`
                                <li>
                                    <label for="pagerows">
                                        Rows
                                        <input id="pagerows" type="number" 
                                            value=${this.page.rows} @change=${(e: Event) => this.rowsChange(e)}>
                                    </label>
                                </li>
                                <li>
                                    <label for="pagecols">
                                        Cols
                                        <input id="pagecols" type="number" 
                                            value=${this.page.cols} @change=${(e: Event) => this.colsChange(e)}>
                                    </label>
                                </li>
                                <li>
                                    <label for="newapp">
                                        NewApp
                                        <button @click=${() => this.addApp()}>Add</button>
                                    </label>
                                </li>
                            `: html`
                                <span>no page</span>
                            `}
                            
                        </ul>
                    </nav>
                </menu-popup>
                <!--<h2>Grid</h2>
                -->
            </header>
            ${this.page ? html`
                <dash-grid .apps=${this.gridApps} 
                    rows="${this.page.rows}" cols="${this.page.cols}" 
                    .edit=${this.adminMode}
                    @app-config-changed=${(e: CustomEvent) => this.updateConf(e)}>
                </dash-grid>`
                : html`
                    <p>no page</p>
                `
            }
            
        `
    }
    async updateConf(e: CustomEvent) {
        const conf = e.detail as GridAppConf
        console.log("save conf", conf)
        await dataService.saveAppConfig(conf as GridAppPageConf)
        this.getAppsConf()
    }
}