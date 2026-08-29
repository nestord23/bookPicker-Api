import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import {
  globalErrorHandler,
  jsonParseErrorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import authorRoutes from "./routes/author.routes.js";
import bookRoutes from "./routes/book.routes.js";
import userBookRoutes from "./routes/userBook.routes.js";

const BODY_LIMIT = "10mb";

/**
 * Construye y configura la aplicación Express.
 *
 * Separar la creación de la app del arranque del servidor permite
 * que los tests de integración usen esta misma app con supertest
 * sin ocupar un puerto real.
 *
 * Las rutas de la API se registran aquí conforme se implementen.
 */
export function createApp(): Express {
  const app = express();

  // Middlewares globales
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: BODY_LIMIT }));

  // Ruta raíz informativa
  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "API Book Picker - Backend",
      status: "running",
    });
  });

  // Health check para monitoreo/load balancers
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Rutas de la API (se agregan por fase):
  app.use("/api/auth", authRoutes);
  app.use("/api/authors", authorRoutes);
  app.use("/api/books", bookRoutes);
  app.use("/api/me/books", userBookRoutes);

  // Handlers finales — el orden es obligatorio:
  // errores de parsing → 404 → error global
  app.use(jsonParseErrorHandler);
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
