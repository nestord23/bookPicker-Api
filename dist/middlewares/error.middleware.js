import { config } from "../config/config.js";
import { ApiError } from "../utils/api-error.js";
function isJsonParseError(err) {
    return (err instanceof SyntaxError &&
        "status" in err &&
        err.status === 400 &&
        "body" in err);
}
/**
 * Traduce errores de parsing de JSON a respuesta 400 clara.
 * Debe registrarse ANTES de las rutas.
 */
export function jsonParseErrorHandler(err, _req, res, next) {
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
export function notFoundHandler(req, res) {
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
export function globalErrorHandler(err, _req, res, _next) {
    const isControlled = err instanceof ApiError;
    const statusCode = isControlled ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    if (statusCode >= 500) {
        console.error("Error no controlado:", err);
    }
    res.status(statusCode).json({
        success: false,
        message: isControlled ? message : "Error interno del servidor",
        error: config.nodeEnv === "development" ? message : undefined,
        stack: config.nodeEnv === "development" && err instanceof Error
            ? err.stack
            : undefined,
    });
}
//# sourceMappingURL=error.middleware.js.map