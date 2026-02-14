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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const SwaggerLayer_1 = __importDefault(require("./SwaggerLayer"));
const getListAPI_1 = __importDefault(require("./getListAPI"));
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-frontend-domain.com",
];
dotenv_1.default.config();
const dataBase = new db_1.default();
const SwaggerLayerKit = new SwaggerLayer_1.default();
const PORT = (process.env.PORT || 9000);
const app = (0, express_1.default)();
app.use(express_1.default.json());
const onUpdateDBBase = (props = {}) => {
    dataBase.MONGODB_URL = (props === null || props === void 0 ? void 0 : props.url) || "";
    dataBase.dbName = (props === null || props === void 0 ? void 0 : props.dbName) || "";
    dataBase.collectionName = (props === null || props === void 0 ? void 0 : props.collectionName) || "";
    dataBase.doConnectInit();
    return props;
};
const onUpdateSwagger = () => {
    // console.log(
    //   "SwaggerLayerKit.renderList",
    //   SwaggerLayerKit.renderList,
    //   SwaggerLayerKit
    // )
    SwaggerLayerKit.app = app;
    SwaggerLayerKit.PORT = PORT;
    SwaggerLayerKit.doInit();
    // SwaggerLayerKit.renderList.map((layers: any) => {
    //   let renderDynamicSwagger = SwaggerLayerKit
    //     ? SwaggerLayerKit[layers ? layers : ""]
    //     : () => "" as any
    //   renderDynamicSwagger()
    // })
};
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (origin === null || origin === void 0 ? void 0 : origin.includes("localhost")) {
            callback(null, true);
        }
        else {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS BK"));
            }
        }
    },
}));
(0, getListAPI_1.default)({ app, dataBase });
app.get("/getList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbName = dataBase.dbName;
        const collectionName = dataBase.collectionName;
        // Default pagination values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (!dbName || !collectionName) {
            res.status(400).send("Missing dbName or collectionName in query params");
            return;
        }
        dataBase.getDatabase({
            // dbName,
            // collectionName,
            skip,
            limit,
            onUpdate: (innerProps) => {
                res.send({
                    page,
                    limit,
                    data: innerProps.data,
                    total: innerProps.totalCount || 0,
                });
            },
        });
    }
    catch (error) {
        console.error("Error in /getLists:", error);
        res.status(500).send("Internal Server Error");
    }
}));
onUpdateDBBase({
    dbName: "Simba_Sample",
    collectionName: "simba_sample",
    url: "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net",
});
onUpdateSwagger();
let server = app.listen(PORT, () => {
    console.log(`I am listening on port  bk ${PORT}`);
});
process.on("SIGINT", () => {
    console.log("SIGINT received, closing server...");
    server.close(() => __awaiter(void 0, void 0, void 0, function* () {
        const Kit = (yield dataBase.getCheckConnection());
        const { status = false } = Kit || {};
        if (status) {
            dataBase.terminateClient();
            process.exit(0);
        }
        else {
            console.log("No DB Connection Available");
            process.exit(0);
        }
        console.log("Server closed gracefully.");
    }));
});
