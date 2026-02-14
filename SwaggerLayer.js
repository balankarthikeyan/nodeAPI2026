"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
class SwaggerLayer {
    constructor() {
        this.PORT = 9000;
        this.HOST = "localhost";
        this.app = null;
        this.swaggerOptions = null;
        this.swaggerSpec = null;
        this.renderList = ["renderGetListPost"];
        this.swaggerTitle = "My API Docs";
        this.swaggerVersion = "1.0.0";
        this.swaggerDescription = "API documentation with Swagger";
        this.openAPIVersion = "3.0.0";
        this.doInit = () => {
            this.swaggerOptions = {
                definition: {
                    openapi: "3.0.0",
                    info: {
                        title: this.swaggerTitle,
                        version: this.swaggerVersion,
                        description: this.swaggerDescription,
                    },
                    servers: [
                        {
                            url: `http://${this.HOST}:${this.PORT}`,
                        },
                    ],
                },
                apis: ["./main.ts"], // 👈 path to your files with Swagger comments
            };
            this.swaggerSpec = (0, swagger_jsdoc_1.default)(this.swaggerOptions);
            this.renderAPIGetListPost();
        };
        this.renderAPIGetListPost = () => {
            this.app.use("/api-docs", swagger_ui_express_1.default.serve, 
            // swaggerUi.setup(this.swaggerSpec)
            swagger_ui_express_1.default.setup(swagger_json_1.default));
            console.log("renderGetListPost Trigger");
        };
    }
}
exports.default = SwaggerLayer;
