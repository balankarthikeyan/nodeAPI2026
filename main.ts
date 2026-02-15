import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import DB from "./db"
import SwaggerLayer from "./SwaggerLayer"
import getListAPI from "./getListAPI"
import getGetListAPI from "./getGetListAPI"
import cors from "cors"
dotenv.config()
const port = process.env.PORT || 9000
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
const SwaggerLayerKit: any = new SwaggerLayer() as any
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
  SwaggerLayerKit.PORT = port
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

// mongoose
//   .connect("mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net")
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err))

// const db = mongoose.connection.useDb("Simba_Sample")

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

app.get("/", (req: any, res: any) => {
  res.send(`App is working fine BK3`)
})

app.use((req: any, res: any, next: any) => {
  res.status(404).send("Sorry can't find that!")
})

export default app
