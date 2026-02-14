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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
const tokenPrefix = "Bearer ";
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-frontend-domain.com",
]; // Replace with your allowed origins
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
let dbName = "simba_sample";
let collectionName = "simba_sample";
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // !origin allows tools like postman and curl
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}));
console.log("TEST>>>>>");
const dataBase = new db_1.default();
dataBase.MONGODB_URL =
    "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net";
// dataBase.MONGODB_URL =
//   "mongodb+srv://karthikeyanbalan:Dinner1234@bk.glsqe.mongodb.net";
dataBase.dbName = dbName;
dataBase.collectionName = collectionName;
const secretKey = "karthikeyanbalan";
const { sign = () => "", verify = () => "" } = jsonwebtoken_1.default;
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    let token = authHeader;
    if (token.includes(tokenPrefix)) {
        token = token.replace(tokenPrefix, "");
    }
    if (token == null || token == undefined) {
        return res.sendStatus(401);
    }
    verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        } // Invalid token
        req.user = user; // Store user data in request object
        next(); // Proceed to the next middleware or route handler
    });
});
app.get("/getVerifyToken", authenticate, (req, res) => {
    res.json({ message: "Protected route accessed!" });
});
app.get("/getToken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        userId: 123,
        username: "john_doe",
        role: "admin",
    };
    const options = {
        expiresIn: "1h", // Token expiration time (e.g., '1h', '1d', '7d')
    };
    const token = sign(payload, secretKey, options);
    res.send({ data: token });
}));
app.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Triggered list api");
    if (!req.body) {
        res.status(400).send("Bad request");
        return; // Stop further execution after response
    }
    // dataBase.getDatabase({
    //   dbName,
    //   collectionName,
    //   onUpdate: (innerProps: any) => {
    //     res.send({ data: innerProps.data })
    //   },
    // })
}));
app.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = (req === null || req === void 0 ? void 0 : req.body) || {};
    if (!req.body) {
        res.status(400).send("Bad request");
        return; // Stop further execution after response
    }
    dataBase.doUpdateDatabase({
        dbName,
        collectionName,
        pushObjectData: data,
        onUpdate: (innerProps) => {
            res.json({ message: "add successful", data: req.body });
        },
    });
}));
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    console.log(`Deleting record with id: ${id}`);
    dataBase.doDeleteDatabase({
        dbName,
        collectionName,
        removeId: id,
        onUpdate: (innerProps) => {
            res.json({ message: `Record with id ${id} deleted successfully` });
        },
    });
});
app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`);
});
