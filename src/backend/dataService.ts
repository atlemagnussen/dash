import { GridAppConf } from "../dash"

export async function getConfig() {
    const res = await fetch("state.json")
    const data = await res.json()
    return data as GridAppConf[]
}