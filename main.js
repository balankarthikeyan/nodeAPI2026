"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const SwaggerLayer_1 = __importDefault(require("./SwaggerLayer"));
const getListAPI_1 = __importDefault(require("./getListAPI"));
const getGetListAPI_1 = __importDefault(require("./getGetListAPI"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const port = process.env.PORT || 9000;
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
    SwaggerLayerKit.PORT = port;
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
(0, getGetListAPI_1.default)({ app, dataBase });
// mongoose
//   .connect("mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net")
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err))
// const db = mongoose.connection.useDb("Simba_Sample")
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
app.get("/", (req, res) => {
    res.send(`App is working fine BK3`);
});
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});
exports.default = app;
