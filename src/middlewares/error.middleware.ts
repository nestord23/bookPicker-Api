import type { NextFunction, Request, Response } from "express";
import { config } from "../config/config.js";
import { ApiError } from "../utils/api-error.js";

/** Forma del error que emite body-parser cuando el JSON es inválido */
type JsonParseError = SyntaxError & { status: number };

function isJsonParseError(err: unknown): err is JsonParseError {
  return (
    err instanceof SyntaxError &&
    "status" in err &&
    (err as JsonParseError).status === 400 &&
    "body" in err
  );
}

/**
 * Traduce errores de parsing de JSON a respuesta 400 clara.
 * Debe registrarse ANTES de las rutas.
 */
export function jsonParseErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!isJsonParseError(err)) {
    next(err);
    return;
  }
  res.status(400).json({
    success: false,
    message: "JSON inválido. Verifica el formato de los datos enviados.",
    error: config.nodeEnv === "development" ? err.message : undefined,
  });
}

/**
 * Responde 404 a toda ruta no registrada.
 * Se registra DESPUÉS de todas las rutas.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
}

/**
 * Handler global de errores: último middleware de la app.
 *
 * - ApiError → responde su statusCode y mensaje (errores controlados).
 * - Cualquier otro error → 500 genérico sin filtrar detalles al cliente.
 */
export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isControlled = err instanceof ApiError;
  const statusCode = isControlled ? err.statusCode : 500;
  const message =
    err instanceof Error ? err.message : "Error interno del servidor";

  if (statusCode >= 500) {
    console.error("Error no controlado:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: isControlled ? message : "Error interno del servidor",
    error: config.nodeEnv === "development" ? message : undefined,
    stack:
      config.nodeEnv === "development" && err instanceof Error
        ? err.stack
        : undefined,
  });
}
