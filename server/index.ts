import path from "path"
import express from "express"
import bodyParser from "body-parser"

const app = express()
app.use(bodyParser.json()) 

const rootFolder = path.resolve(path.dirname(''))
console.log("rootFolder", rootFolder)
const web = path.resolve("dist")
console.log("web", web)
//const webIndex = path.resolve(web, "index.html")

// app.put("/save", async (req, res) => {
//     console.log("search", req.path)
//     console.log("body", req.body)
//     res.send("")
// })

app.use(express.static(web))


let port = process.env.PORT ? parseInt(process.env.PORT) : 5000
let host = "::"
app.listen(port, host, () => {
    console.log(`[server]: Server is running at http://${host}:${port}`)
})
