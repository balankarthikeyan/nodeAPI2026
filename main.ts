import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import DB from "./db"
import SwaggerLayer from "./SwaggerLayer"
import getListAPI from "./getListAPI"
import getGetListAPI from "./getGetListAPI"
dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT || 9000
app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://your-frontend-domain.com",
]

// ✅ DB Instance
const dataBase = new DB() as any

// ✅ Swagger instance
const SwaggerLayerKit: any = new SwaggerLayer()

/* ---------------- DB INIT (IMPORTANT) ---------------- */
const onUpdateDBBase = () => {
  dataBase.MONGODB_URL =
    "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net"
  dataBase.dbName = "Simba_Sample"
  dataBase.collectionName = "simba_sample"

  dataBase.doConnectInit()
}

/* ---------------- Swagger INIT ---------------- */
const onUpdateSwagger = () => {
  SwaggerLayerKit.app = app
  SwaggerLayerKit.doInit()
}

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: (origin: any, callback) => {
      if (origin?.includes("localhost")) return callback(null, true)
      if (allowedOrigins.includes(origin) || !origin)
        return callback(null, true)

      callback(new Error("Not allowed by CORS"))
    },
  }),
)

/* ---------------- INIT BEFORE ROUTES ---------------- */
onUpdateDBBase()
onUpdateSwagger()

/* ---------------- ROUTES ---------------- */
getListAPI({ app, dataBase })
getGetListAPI({ app, dataBase })
// app.use((err: any, req: any, res: any, next: any) => {
//   console.error(err.stack)
//   res.status(500).send("Something broke!")
// })

// app.get("/:name", (req: any, res: any) => {
//   const { name } = req.params
//   res.status(200).send(`Name BK : ${name}`)
// })

app.get("/", (req: any, res: any) => {
  res.send(`App is working fine BK2`)
})

app.use((req: any, res: any, next: any) => {
  res.status(404).send("Sorry can't find that!")
})

export default app
