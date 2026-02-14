import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT || 9000

mongoose
  .connect(
    "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net/Simba_Sample",
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err))

// mongoose
//   .connect(
//     (process.env.MONGO_URI ||
//       "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net") as string,
//   )
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err))
app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

app.get("/:name", async (req: any, res: any) => {
  const { name } = req.params

  const simbaSchema = new mongoose.Schema(
    {
      name: String,
      phone: Number,
    },
    { collection: "simba_sample" }, // collection name
  )

  const Simba = mongoose.models.simba || mongoose.model("simba", simbaSchema)
  // const Simba = mongoose.model("simba", simbaSchema)
  const data = await Simba.find()
  console.log(data)
  // console.log(Employee)
  res.status(200).send(`Name BK : ${JSON.stringify(data)}`)
})

app.get("/", (req: any, res: any) => {
  res.send(`App is working fine BK2`)
})

app.use((req: any, res: any, next: any) => {
  res.status(404).send("Sorry can't find that!")
})

export default app
