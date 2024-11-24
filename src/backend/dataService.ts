import { GridAppConf } from "../dash"
import * as db from "./webDb"

export async function getConfig() {
    const res = await fetch("state.json")
    const data = await res.json()
    const appConfs = data as GridAppConf[]
    return appConfs
}

export async function saveAppConfig(appConf: GridAppConf) {
    const exists = await getAppConfig(appConf.id)
    await db.saveOneItem(db.Tables.AppConfigs, appConf, !!exists)
}

export async function getAppConfig(id: string) {
    const value = await db.getOneIem<GridAppConf>(db.Tables.AppConfigs, id)
    return value
}

export async function getAllAppConfigs() {
    const values = await db.getAll<GridAppConf>(db.Tables.AppConfigs)
    return values
}
