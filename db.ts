import mongoose, { Schema, Model } from "mongoose"

class DB {
  MONGODB_URL = "" as string
  dbName = "" as string
  collectionName = "" as string
  globalConnection: typeof mongoose | null = null
  model: Model<any> | null = null

  async setClient() {
    if (!this.globalConnection) {
      this.globalConnection = await mongoose.connect(this.MONGODB_URL, {
        dbName: this.dbName,
      })
      console.log("DB Connected")
    } else {
      console.log("Client Already Connected")
    }
  }

  async terminateClient() {
    console.log("DB Close!!!")
    await mongoose.disconnect()
    this.globalConnection = null
  }

  async doConnectInit() {
    await this.setClient()

    const schema = new Schema({}, { strict: false })

    this.model =
      mongoose.models[this.collectionName] ||
      mongoose.model(this.collectionName, schema, this.collectionName)
  }

  async getDatabase(props: {
    onUpdate: (propsInner: any) => void
    skip?: number
    limit?: number
  }) {
    const { onUpdate = () => {}, skip = 0, limit = 0 } = props || {}

    try {
      if (!this.model) await this.doConnectInit()

      const totalCount = await this.model!.countDocuments({})
      const data = await this.model!.find({}).skip(skip).limit(limit)

      onUpdate({ data, totalCount })
    } catch (e) {
      onUpdate({ error: e })
    }
  }

  async doUpdateDatabase(props: {
    onUpdate: (propsInner: any) => void
    pushObjectData: any
  }) {
    const { onUpdate = () => {}, pushObjectData = {} } = props || {}

    await this.doConnectInit()
    const result = await this.model!.create(pushObjectData)
    onUpdate(result)
    await this.terminateClient()
  }

  async doDeleteDatabase(props: {
    onUpdate: (propsInner: any) => void
    removeId: string
  }) {
    const { onUpdate = () => {}, removeId = "" } = props || {}

    await this.doConnectInit()
    const result = await this.model!.deleteOne({ _id: removeId })
    onUpdate(result)
    await this.terminateClient()
  }
}

export default DB
