import {LitElement, css} from "lit"
import {html} from "lit/static-html.js"
import {customElement, property, state} from "lit/decorators.js"
import { unsafeStatic } from "lit/static-html.js"
import { GridAppConf } from "../dash/index.js"

@customElement('app-resolver')
export class AppResolver extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
    `

    _appConf: GridAppConf | undefined

    @property({attribute: 'app-conf', type: Object})
    set appconf(value: GridAppConf) {
        this._appConf = value
        this.config = this._appConf?.config
    }
    get appconf(): GridAppConf | undefined {
        return this._appConf
    }

    @state()
    config?: string

    @property({attribute: true, type: Boolean,})
    editMode = false

    configChanged(e: CustomEvent) {
        const detail = e.detail
        console.log(detail)
    }
    render() {
        if (!this.appconf || !this.appconf.app)
            return html`
                <span>No component</span>
            `
        const tag = unsafeStatic(this.appconf.app)
        return html`
            <${tag} 
                .config=${this.config} 
                .editMode=${this.editMode} 
                @config-changed=${(e: CustomEvent) => this.configChanged(e)}>
            </${tag}>
        `
    }
}