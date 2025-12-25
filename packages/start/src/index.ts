import "./leftMenu.js"
import "./frameLoader.js"

import { doImportWa } from "@dash/design"

doImportWa().then(() => {
    console.log("loaded WA")
})