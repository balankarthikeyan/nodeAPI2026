import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import DB from "./db"
import SwaggerLayer from "./SwaggerLayer"
import getListAPI from "./getListAPI"
import getGetListAPI from "./getGetListAPI"
const PORT = (process.env.PORT || 9000) as any
dotenv.config()

const app = express()
app.use(express.json())

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

app.listen(PORT, () => {
  console.log(`I am listening on port ${PORT}`)
})
/* ---------------- EXPORT FOR VERCEL ---------------- */
export default app
