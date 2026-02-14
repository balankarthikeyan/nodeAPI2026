import { MongoClient, ObjectId } from "mongodb"

class db {
  MONGODB_URL = "" as string
  globalClient = null as any
  dbName = "" as any
  collectionName = "" as string
  dbCollection = null as any
  async setClient() {
    if (this.globalClient === null) {
      this.globalClient = await MongoClient.connect(this.MONGODB_URL)
    } else {
      console.log("Client Already Connected")
    }
  }

  async getCheckConnection() {
    return { status: this?.globalClient?.topology?.isConnected() || false }
  }
  async terminateClient() {
    console.log("DB Close!!!")
    this.globalClient.close()
    this.globalClient = null
  }

  async doConnectInit() {
    console.log("Connection Established")
    await this?.setClient()
    const dbCollection = await this.globalClient
      .db(this.dbName)
      .collection(this.collectionName)
    this.dbCollection = dbCollection
  }

  async getDatabase(props: {
    onUpdate: (propsInner: any) => void
    dbName?: string
    collectionName?: string
    skip?: any
    limit?: any
  }) {
    const {
      onUpdate = () => "",
      dbName = this.dbName || "",
      collectionName = this.collectionName || "",
      skip = 0,
      limit = 0,
    } = props || {}

    // await this?.setClient()
    // const dbCollection = await this.globalClient
    //   .db(dbName)
    //   .collection(collectionName)

    const dbCollection = this.dbCollection
    const totalCount = await dbCollection.countDocuments({})

    dbCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray((err: any, docs: any) => {})
      .then((r: any) => {
        onUpdate({ data: r, totalCount })
      })
      .catch((e: any) => {
        onUpdate({ error: e })
      })
  }

  async doUpdateDatabase(props: {
    onUpdate: (propsInner: any) => void
    dbName?: string
    collectionName?: string
    pushObjectData: any
  }) {
    const {
      onUpdate = () => "",
      dbName = this.dbName || "",
      collectionName = this.collectionName || "",
      pushObjectData = {},
    } = props || {}
    await this?.setClient()
    const dbCollection = await this.globalClient
      .db(dbName)
      .collection(collectionName)
    const insertResult = await dbCollection.insertOne(pushObjectData)
    onUpdate(insertResult)
    await this?.terminateClient()
  }
  async doDeleteDatabase(props: {
    onUpdate: (propsInner: any) => void
    dbName?: string
    collectionName?: string
    removeId: any
  }) {
    const {
      onUpdate = () => "",
      dbName = this.dbName || "",
      collectionName = this.collectionName || "",
      removeId = "",
    } = props || {}

    await this?.setClient()
    const dbCollection = await this.globalClient
      .db(dbName)
      .collection(collectionName)
    const insertResult = await dbCollection.deleteOne({
      _id: new ObjectId(removeId),
    })
    onUpdate(insertResult)
    await this?.terminateClient()
  }
}

export default db
