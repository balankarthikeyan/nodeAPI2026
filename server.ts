import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import JWT from "jsonwebtoken"
import DB from "./db"
dotenv.config()

const tokenPrefix = "Bearer "
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://your-frontend-domain.com",
] // Replace with your allowed origins

const PORT = process.env.PORT || 8080
const app = express()
let dbName = "simba_sample"
let collectionName = "simba_sample"

app.use(express.json())
app.use(
  cors({
    origin: (origin: any, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // !origin allows tools like postman and curl
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
  })
)

console.log("TEST>>>>>")
const dataBase = new DB()
dataBase.MONGODB_URL =
  "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net"
// dataBase.MONGODB_URL =
//   "mongodb+srv://karthikeyanbalan:Dinner1234@bk.glsqe.mongodb.net";
dataBase.dbName = dbName
dataBase.collectionName = collectionName
const secretKey = "karthikeyanbalan"
const { sign = () => "", verify = () => "" } = JWT as any

const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"]
  let token = authHeader

  if (token.includes(tokenPrefix)) {
    token = token.replace(tokenPrefix, "")
  }

  if (token == null || token == undefined) {
    return res.sendStatus(401)
  }
  verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403)
    } // Invalid token
    req.user = user // Store user data in request object
    next() // Proceed to the next middleware or route handler
  })
}
app.get("/getVerifyToken", authenticate, (req, res) => {
  res.json({ message: "Protected route accessed!" })
})
app.get("/getToken", async (req: any, res: any) => {
  const payload = {
    userId: 123,
    username: "john_doe",
    role: "admin",
  }

  const options = {
    expiresIn: "1h", // Token expiration time (e.g., '1h', '1d', '7d')
  }

  const token = sign(payload, secretKey, options)

  res.send({ data: token })
})
app.get("/list", async (req: any, res: any) => {
  console.log("Triggered list api")

  if (!req.body) {
    res.status(400).send("Bad request")
    return // Stop further execution after response
  }
  // dataBase.getDatabase({
  //   dbName,
  //   collectionName,
  //   onUpdate: (innerProps: any) => {
  //     res.send({ data: innerProps.data })
  //   },
  // })
})
app.post("/add", async (req: any, res: any) => {
  let data = req?.body || {}
  if (!req.body) {
    res.status(400).send("Bad request")
    return // Stop further execution after response
  }

  dataBase.doUpdateDatabase({
    dbName,
    collectionName,
    pushObjectData: data,
    onUpdate: (innerProps: any) => {
      res.json({ message: "add successful", data: req.body })
    },
  })
})

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id

  console.log(`Deleting record with id: ${id}`)
  dataBase.doDeleteDatabase({
    dbName,
    collectionName,
    removeId: id,
    onUpdate: (innerProps: any) => {
      res.json({ message: `Record with id ${id} deleted successfully` })
    },
  })
})

app.listen(PORT, () => {
  console.log(`I am listening on port ${PORT}`)
})
