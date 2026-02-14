"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
app.get("/:name", (req, res) => {
    const { name } = req.params;
    res.status(200).send(`Name BK : ${name}`);
});
app.get("/", (req, res) => {
    res.send(`App is working fine BK`);
});
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});
exports.default = app;
