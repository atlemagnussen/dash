const DBNAME = "dash"
const DBVERSION = 3
export enum Tables {
    AppConfigs = "AppConfigs",
    GridPages = "GridPages"
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
            let txn = dbReq.transaction
            console.log(`IndexedDB:: Upgrade DB ${dbu.name} to version ${dbu.version}`)
            if (dbu.version == 1) {
                const appConfigStore = dbu.createObjectStore(Tables.AppConfigs, { keyPath: "id"})
                appConfigStore.createIndex("id", "id", { unique: true })
            }
            if (dbu.version == 2) {
                const pageStore = dbu.createObjectStore(Tables.GridPages, { keyPath: "id"})
                pageStore.createIndex("id", "id", { unique: true })
            }
            if (dbu.version == 3) {
                if (txn) {
                    const appConfigStore = txn.objectStore(Tables.AppConfigs)
                    appConfigStore.createIndex("pageId", "pageId", { unique: true })
                }
            }
            if (dbu.version == 4) {
                if (txn) {
                    const appConfigStore = txn.objectStore(Tables.AppConfigs)
                    appConfigStore.deleteIndex("pageId")
                    appConfigStore.createIndex("pageId", "pageId", { unique: false })
                }
            }
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

export function getMany<T>(table: Tables, pageId: string): Promise<T[]> {
    return openDbPromise.then(db => {

        return new Promise((resolve, reject) => {
            if (!db)
                reject("not connected")
            
            const tx = db.transaction([table], "readonly")
            const store = tx.objectStore(table)
            const pageIndex = store.index("pageId")

            const query = pageIndex.getAll(pageId)
            
            //const req = store.getAll(pageId)
            query.onsuccess = () => resolve(query.result)
            query.onerror = err => reject(err)
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
