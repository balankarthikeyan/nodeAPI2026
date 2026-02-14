import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerDocument from "./swagger.json"

class SwaggerLayer {
  PORT = 9000 as any
  HOST = "localhost" as any
  app = null as any
  swaggerOptions = null as any
  swaggerSpec = null as any
  renderList = ["renderGetListPost"] as any
  swaggerTitle = "My API Docs" as any
  swaggerVersion = "1.0.0" as any
  swaggerDescription = "API documentation with Swagger" as any
  openAPIVersion = "3.0.0" as any

  doInit = () => {
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
    }
    this.swaggerSpec = swaggerJsdoc(this.swaggerOptions)
    this.renderAPIGetListPost()
  }
  renderAPIGetListPost = () => {
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      // swaggerUi.setup(this.swaggerSpec)
      swaggerUi.setup(swaggerDocument),
    )
    console.log("renderGetListPost Trigger")
  }
}

export default SwaggerLayer
