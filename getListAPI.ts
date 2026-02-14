const getListAPI = (props = {} as any) => {
  const { app, dataBase } = props || {}
  app.post("/getLists", async (req: any, res: any) => {
    try {
      const { page, limit } = req.body || {}
      const skip = (page - 1) * limit

      if (!page || !limit) {
        res.status(400).json({ error: "Missing page or limit in request body" })
        return
      }
      dataBase.getDatabase({
        skip,
        limit,
        // dbName: dataBaseUpdate.dbName,
        // collectionName: dataBaseUpdate.collectionName,
        onUpdate: (innerProps: any) => {
          console.log({ data: innerProps.data })
          res.json({
            page,
            limit,
            data: innerProps.data,
            total: innerProps.totalCount || 0,
          })
        },
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  })
}

export default getListAPI
