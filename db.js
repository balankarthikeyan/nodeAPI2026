"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class db {
    constructor() {
        this.MONGODB_URL = "";
        this.globalClient = null;
        this.dbName = "";
        this.collectionName = "";
        this.dbCollection = null;
    }
    setClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.globalClient === null) {
                this.globalClient = yield mongodb_1.MongoClient.connect(this.MONGODB_URL);
            }
            else {
                console.log("Client Already Connected");
            }
        });
    }
    getCheckConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return { status: ((_b = (_a = this === null || this === void 0 ? void 0 : this.globalClient) === null || _a === void 0 ? void 0 : _a.topology) === null || _b === void 0 ? void 0 : _b.isConnected()) || false };
        });
    }
    terminateClient() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DB Close!!!");
            this.globalClient.close();
            this.globalClient = null;
        });
    }
    doConnectInit() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Connection Established");
            yield (this === null || this === void 0 ? void 0 : this.setClient());
            const dbCollection = yield this.globalClient
                .db(this.dbName)
                .collection(this.collectionName);
            this.dbCollection = dbCollection;
        });
    }
    getDatabase(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { onUpdate = () => "", dbName = this.dbName || "", collectionName = this.collectionName || "", skip = 0, limit = 0, } = props || {};
            // await this?.setClient()
            // const dbCollection = await this.globalClient
            //   .db(dbName)
            //   .collection(collectionName)
            const dbCollection = this.dbCollection;
            const totalCount = yield dbCollection.countDocuments({});
            dbCollection
                .find()
                .skip(skip)
                .limit(limit)
                .toArray((err, docs) => { })
                .then((r) => {
                onUpdate({ data: r, totalCount });
            })
                .catch((e) => {
                onUpdate({ error: e });
            });
        });
    }
    doUpdateDatabase(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { onUpdate = () => "", dbName = this.dbName || "", collectionName = this.collectionName || "", pushObjectData = {}, } = props || {};
            yield (this === null || this === void 0 ? void 0 : this.setClient());
            const dbCollection = yield this.globalClient
                .db(dbName)
                .collection(collectionName);
            const insertResult = yield dbCollection.insertOne(pushObjectData);
            onUpdate(insertResult);
            yield (this === null || this === void 0 ? void 0 : this.terminateClient());
        });
    }
    doDeleteDatabase(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { onUpdate = () => "", dbName = this.dbName || "", collectionName = this.collectionName || "", removeId = "", } = props || {};
            yield (this === null || this === void 0 ? void 0 : this.setClient());
            const dbCollection = yield this.globalClient
                .db(dbName)
                .collection(collectionName);
            const insertResult = yield dbCollection.deleteOne({
                _id: new mongodb_1.ObjectId(removeId),
            });
            onUpdate(insertResult);
            yield (this === null || this === void 0 ? void 0 : this.terminateClient());
        });
    }
}
exports.default = db;
