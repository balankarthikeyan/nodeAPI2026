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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 9000;
mongoose_1.default
    .connect("mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net/Simba_Sample")
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));
// mongoose
//   .connect(
//     (process.env.MONGO_URI ||
//       "mongodb+srv://admin:admin@simba-cluster.wv87zgs.mongodb.net") as string,
//   )
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err))
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
app.get("/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const simbaSchema = new mongoose_1.default.Schema({
        name: String,
        phone: Number,
    }, { collection: "simba_sample" });
    const Simba = mongoose_1.default.models.simba || mongoose_1.default.model("simba", simbaSchema);
    // const Simba = mongoose.model("simba", simbaSchema)
    const data = yield Simba.find();
    console.log(data);
    // console.log(Employee)
    res.status(200).send({ data });
}));
app.get("/", (req, res) => {
    res.send(`App is working fine BK2`);
});
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});
exports.default = app;
