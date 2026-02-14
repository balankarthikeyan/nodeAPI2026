import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import DB from "./db"
import SwaggerLayer from "./SwaggerLayer"
import getListAPI from "./getListAPI"
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://your-frontend-domain.com",
]
dotenv.config()
const dataBase = new DB()
const SwaggerLayerKit = new SwaggerLayer() as any
const PORT = (process.env.PORT || 9000) as any
const app = express()

app.use(express.json())
const onUpdateDBBase = (props: any = {}) => {
  dataBase.MONGODB_URL = props?.url || ""
  dataBase.dbName = props?.dbName || ""
  dataBase.collectionName = props?.collectionName || ""
  dataBase.doConnectInit()

  return props
}

const onUpdateSwagger = () => {
  // console.log(
  //   "SwaggerLayerKit.renderList",
  //   SwaggerLayerKit.renderList,
  //   SwaggerLayerKit
  // )
  SwaggerLayerKit.app = app
  SwaggerLayerKit.PORT = PORT
  SwaggerLayerKit.doInit()

  // SwaggerLayerKit.renderList.map((layers: any) => {
  //   let renderDynamicSwagger = SwaggerLayerKit
  //     ? SwaggerLayerKit[layers ? layers : ""]
  //     : () => "" as any
  //   renderDynamicSwagger()
  // })
}

app.use(
  cors({
    origin: (origin: any, callback) => {
      if (origin?.includes("localhost")) {
        callback(null, true)
      } else {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error("Not allowed by CORS BK"))
        }
      }
    },
  }),
)

getListAPI({ app, dataBase })

app.get("/getList", async (req: any, res: any) => {
  try {
    const dbName = dataBase.dbName as string
    const collectionName = dataBase.collectionName as string

    // Default pagination values
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    if (!dbName || !collectionName) {
      res.status(400).send("Missing dbName or collectionName in query params")
      return
    }
    dataBase.getDatabase({
      // dbName,
      // collectionName,
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
    console.error("Error in /getLists:", error)
    res.status(500).send("Internal Server Error")
  }
})

let server = app.listen(PORT, () => {
  onUpdateDBBase({
    dbName: "Simba_Sample",
    collectionName: "simba_sample",
    url: "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net",
  })
  onUpdateSwagger()
  console.log(`I am listening on port ${PORT}`)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, closing server...")
  server.close(async () => {
    const Kit = (await dataBase.getCheckConnection()) as any
    const { status = false } = Kit || {}
    if (status) {
      dataBase.terminateClient()
      process.exit(0)
    } else {
      console.log("No DB Connection Available")
      process.exit(0)
    }
    console.log("Server closed gracefully.")
  })
})
