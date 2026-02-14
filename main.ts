import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import serverless from "serverless-http"

import DB from "./db"
import SwaggerLayer from "./SwaggerLayer"
import getListAPI from "./getListAPI"

dotenv.config()

const app = express()
const dataBase = new DB()
const SwaggerLayerKit: any = new SwaggerLayer()

app.use(express.json())

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://your-frontend-domain.com",
]

app.use(
  cors({
    origin: (origin: any, callback: any) => {
      if (origin?.includes("localhost")) callback(null, true)
      else if (allowedOrigins.indexOf(origin) !== -1 || !origin)
        callback(null, true)
      else callback(new Error("Not allowed by CORS"))
    },
  }),
)

getListAPI({ app, dataBase })

app.get("/getList", async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    dataBase.getDatabase({
      skip,
      limit,
      onUpdate: (innerProps: any) => {
        res.send({
          page,
          limit,
          data: innerProps.data,
          total: innerProps.totalCount || 0,
        })
      },
    })
  } catch (error) {
    res.status(500).send("Internal Server Error")
  }
})

dataBase.MONGODB_URL =
  "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net"
dataBase.dbName = "Simba_Sample"
dataBase.collectionName = "simba_sample"
dataBase.doConnectInit()

SwaggerLayerKit.app = app
SwaggerLayerKit.doInit()

export default serverless(app)
