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
const PORT = (process.env.PORT || 9000);
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-frontend-domain.com",
];
// ✅ DB Instance
const dataBase = new db_1.default();
// ✅ Swagger instance
const SwaggerLayerKit = new SwaggerLayer_1.default();
/* ---------------- DB INIT (IMPORTANT) ---------------- */
const onUpdateDBBase = () => {
    dataBase.MONGODB_URL =
        "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net";
    dataBase.dbName = "Simba_Sample";
    dataBase.collectionName = "simba_sample";
    dataBase.doConnectInit();
};
/* ---------------- Swagger INIT ---------------- */
const onUpdateSwagger = () => {
    SwaggerLayerKit.app = app;
    SwaggerLayerKit.doInit();
};
/* ---------------- CORS ---------------- */
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (origin === null || origin === void 0 ? void 0 : origin.includes("localhost"))
            return callback(null, true);
        if (allowedOrigins.includes(origin) || !origin)
            return callback(null, true);
        callback(new Error("Not allowed by CORS"));
    },
}));
/* ---------------- INIT BEFORE ROUTES ---------------- */
onUpdateDBBase();
onUpdateSwagger();
/* ---------------- ROUTES ---------------- */
(0, getListAPI_1.default)({ app, dataBase });
app.get("/getList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbName = dataBase.dbName;
        const collectionName = dataBase.collectionName;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (!dbName || !collectionName) {
            return res.status(400).send("Missing dbName or collectionName");
        }
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
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}));
app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`);
});
/* ---------------- EXPORT FOR VERCEL ---------------- */
exports.default = app;
