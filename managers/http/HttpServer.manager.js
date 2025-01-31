const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

module.exports = class HttpServer {
  constructor({ config, managers, cortex }) {
    this.config = config;
    this.userApi = managers.userApi;
    this.app = express();
    this.cortex = cortex;
    this.server = null;
  }

  /** Apply middlewares */
  applyMiddlewares() {
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/static", express.static("public"));

    // Security headers
    this.app.use(helmet());

    // Rate limiting
    const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15-minute window
      max: 100, // Limit each IP to 100 requests per window
      message: {
        ok: false,
        data: {},
        errors: [],
        message: "Too many requests, please try again later.",
      },
      standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
      legacyHeaders: false, // Disable `X-RateLimit-*` headers
    });

    this.app.use("/api/", apiLimiter);

    // Error handling middleware
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    });
  }

  /** Initialize routes */
  setupRoutes() {
    this.app.all("/api/:moduleName/:fnName/:id", this.userApi.mw);
    this.app.all("/api/:moduleName/:fnName", this.userApi.mw);
    this.app.get("/api/ping", (req, res) => {
      res.send("Pong");
    });
    this.setupSwagger();
  }

  /** Start the server */
  start() {
    console.log("Starting the server");
    this.applyMiddlewares();
    this.setupRoutes();

    this.server = http.createServer(this.app);
    const port = this.config.dotEnv.SERVER_PORT || 3000;

    this.server.listen(port, () => {
      console.log(
        `${this.config.dotEnv.SERVICE_NAME.toUpperCase()} is running on port: ${port}`
      );
    });
  }

  /** Stop the server */
  async stop() {
    if (this.server) {
      this.server.close();
      console.log("Server stopped.");
    }
  }

  getApp() {
    return this.app;
  }

  setupSwagger() {
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "School Management System API",
          version: "1.0.0",
          description:
            "A robust and scalable Node.js API for managing schools, classrooms, and students with role-based access control (RBAC). Built using MongoDB, JWT authentication, and the Axion template structure.",
        },
        servers: [
          {
            url: this.config.dotEnv.SERVER_API,
          },
        ],
      },
      apis: ["./swagger/routes/*.js"],
    };
    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    // Serve Swagger UI
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
};
