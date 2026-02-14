const getGetListAPI = (props = {} as any) => {
  const { app, dataBase } = props || {}
  console.log("getGetListAPI")
  app.get("/getList", async (req: any, res: any) => {
    try {
      const dbName = dataBase.dbName
      const collectionName = dataBase.collectionName

      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit

      if (!dbName || !collectionName) {
        return res.status(400).send("Missing dbName or collectionName")
      }

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
      console.error("Error:", error)
      res.status(500).send("Internal Server Error")
    }
  })
}

export default getGetListAPI
