import { GridAppConf } from "../dash/index.js"
import * as db from "./webDb.js"

export interface GridAppPageConf extends GridAppConf {
    pageId: string
}

export interface GridPage {
    id: string
    rows: number
    cols: number
    apps: GridAppConf[]
}

export async function getConfig() {
    const res = await fetch("state.json")
    const data = await res.json()
    const appConfs = data as GridAppConf[]
    return appConfs
}

export async function saveAppConfig(appConf: GridAppPageConf) {
    const exists = await getAppConfig(appConf.id)
    await db.saveOneItem(db.Tables.AppConfigs, appConf, !!exists)
}

export async function getAppConfig(id: string) {
    const value = await db.getOneIem<GridAppPageConf>(db.Tables.AppConfigs, id)
    return value
}

export async function getPageConfig(id: string) {
    let page = await db.getOneIem<GridPage>(db.Tables.GridPages, id)
    if (!page)
        return null
    const apps = await getAllAppConfigs(id)
    const appsUpdated = apps.map(a => {
        a.pageId = page.id
        return a
    })
    page.apps = appsUpdated
    return page
}
export async function savePage(page: GridPage) {
    const exists = await getPageConfig(page.id)
    await db.saveOneItem<GridPage>(db.Tables.GridPages, page, !!exists)
}

export async function getAllAppConfigs(pageId: string) {
    const values = await db.getMany<GridAppPageConf>(db.Tables.AppConfigs, pageId)
    return values
}
