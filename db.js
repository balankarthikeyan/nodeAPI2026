"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
class DB {
    constructor() {
        this.MONGODB_URL = "";
        this.dbName = "";
        this.collectionName = "";
        this.globalConnection = null;
        this.model = null;
    }
    setClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.globalConnection) {
                this.globalConnection = yield mongoose_1.default.connect(this.MONGODB_URL, {
                    dbName: this.dbName,
                });
                console.log("DB Connected");
            }
            else {
                console.log("Client Already Connected");
            }
        });
    }
    terminateClient() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DB Close!!!");
            yield mongoose_1.default.disconnect();
            this.globalConnection = null;
        });
    }
    doConnectInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setClient();
            const schema = new mongoose_1.Schema({}, { strict: false });
            this.model =
                mongoose_1.default.models[this.collectionName] ||
                    mongoose_1.default.model(this.collectionName, schema, this.collectionName);
        });
    }
    getDatabase(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { onUpdate = () => { }, skip = 0, limit = 0 } = props || {};
            try {
                if (!this.model)
                    yield this.doConnectInit();
                const totalCount = yield this.model.countDocuments({});
                const data = yield this.model.find({}).skip(skip).limit(limit);
                onUpdate({ data, totalCount });
            }
            catch (e) {
                onUpdate({ error: e });
            }
        });
    }
    doUpdateDatabase(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { onUpdate = () => { }, pushObjectData = {} } = props || {};
            yield this.doConnectInit();
            const result = yield this.model.create(pushObjectData);
            onUpdate(result);
            yield this.terminateClient();
        });
    }
    doDeleteDatabase(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { onUpdate = () => { }, removeId = "" } = props || {};
            yield this.doConnectInit();
            const result = yield this.model.deleteOne({ _id: removeId });
            onUpdate(result);
            yield this.terminateClient();
        });
    }
}
exports.default = DB;
