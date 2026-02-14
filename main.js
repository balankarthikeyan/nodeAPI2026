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
const serverless_http_1 = __importDefault(require("serverless-http"));
const db_1 = __importDefault(require("./db"));
const SwaggerLayer_1 = __importDefault(require("./SwaggerLayer"));
const getListAPI_1 = __importDefault(require("./getListAPI"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const dataBase = new db_1.default();
const SwaggerLayerKit = new SwaggerLayer_1.default();
app.use(express_1.default.json());
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-frontend-domain.com",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (origin === null || origin === void 0 ? void 0 : origin.includes("localhost"))
            callback(null, true);
        else if (allowedOrigins.indexOf(origin) !== -1 || !origin)
            callback(null, true);
        else
            callback(new Error("Not allowed by CORS"));
    },
}));
(0, getListAPI_1.default)({ app, dataBase });
app.get("/getList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        dataBase.getDatabase({
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
        res.status(500).send("Internal Server Error");
    }
}));
dataBase.MONGODB_URL =
    "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net";
dataBase.dbName = "Simba_Sample";
dataBase.collectionName = "simba_sample";
dataBase.doConnectInit();
SwaggerLayerKit.app = app;
SwaggerLayerKit.doInit();
exports.default = (0, serverless_http_1.default)(app);
