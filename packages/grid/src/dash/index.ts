import "./dashGrid"

export interface GridApp {
    id: string
    x: number
    y: number
    w: number
    h: number
}

export interface GridAppConf extends GridApp {
    app: string
    config: any
    [others: string]: any
}

export function getTimestampId() {
    const now = Date.now()
    const random = Math.random() * 100
    return `${now}-${random}`
}