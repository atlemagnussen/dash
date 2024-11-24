const DBNAME = "dash"
const DBVERSION = 1
export enum Tables {
    AppConfigs = "AppConfigs"
}

function openDb() : Promise<IDBDatabase>{
    return new Promise((resolve, reject) => {
        const dbReq = indexedDB.open(DBNAME, DBVERSION)
        dbReq.onsuccess = () => {
            resolve(dbReq.result)
        }
        dbReq.onerror = (er) => {
            reject(er)
        }
        dbReq.onupgradeneeded = () => {
            let dbu = dbReq.result
            const objectStore = dbu.createObjectStore(Tables.AppConfigs, { keyPath: "id"})
            objectStore.createIndex("id", "id", { unique: true })
        }
    })
}

const openDbPromise = openDb()

export function getOneIem<T>(table: Tables, query: string): Promise<T> {
    return openDbPromise.then(db => {

        return new Promise((resolve, reject) => {
            if (!db)
                reject("not connected")
            
            const store = db.transaction([table]).objectStore(table)
            
            const req = store.get(query)
            req.onsuccess = () => resolve(req.result)
            req.onerror = err => reject(err)
        })
    })
    
}

export function getAll<T>(table: Tables): Promise<T[]> {
    return openDbPromise.then(db => {

        return new Promise((resolve, reject) => {
            if (!db)
                reject("not connected")
            
            const store = db.transaction([table]).objectStore(table)
            
            const req = store.getAll()
            req.onsuccess = () => resolve(req.result)
            req.onerror = err => reject(err)
        })
    })
}

export function saveOneItem<T>(table: Tables, data: T, update: boolean): Promise<T> {
    return openDbPromise.then(db => {

        return new Promise((resolve, reject) => {
            if (!db)
                reject("no db")
            
            const tx = db.transaction([table], "readwrite")
            tx.onerror = er => {
                reject(er)
            }
            const objectStore = tx.objectStore(table)
            let req = update ? objectStore.put(data) : objectStore.add(data)
            
            req.onsuccess = () => {
                resolve(data)
            }
            req.onerror = ev => {
                reject(ev)
            }
        })
    })
}
