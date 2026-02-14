import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT || 9000
app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

app.get("/:name", (req: any, res: any) => {
  const { name } = req.params
  res.status(200).send(`Name BK : ${name}`)
})

app.get("/", (req: any, res: any) => {
  res.send(`App is working fine BK`)
})

app.use((req: any, res: any, next: any) => {
  res.status(404).send("Sorry can't find that!")
})

export default app
