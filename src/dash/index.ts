import "./dashGrid"

export interface GridApp {
    x: number
    y: number
    w: number
    h: number
}

export interface GridAppConf extends GridApp {
    id: string
    content: string
}

export function getTimestampId() {
    const now = Date.now()
    const random = Math.random() * 100
    return `${now}-${random}`
}