/**
 * Error de aplicación con código HTTP asociado.
 *
 * Los servicios lo lanzan cuando una regla de negocio falla;
 * el error handler global lo convierte en respuesta JSON.
 * Así la lógica de negocio nunca conoce Request/Response.
 */
export class ApiError extends Error {
    /** Código HTTP que el error handler devolverá al cliente */
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        // Requerido al extender clases nativas con target anterior a ES2015
        Object.setPrototypeOf(this, ApiError.prototype);
    }
    static badRequest(message) {
        return new ApiError(400, message);
    }
    static unauthorized(message = "No autorizado") {
        return new ApiError(401, message);
    }
    static forbidden(message = "Prohibido") {
        return new ApiError(403, message);
    }
    static notFound(message = "Recurso no encontrado") {
        return new ApiError(404, message);
    }
    static conflict(message) {
        return new ApiError(409, message);
    }
}
//# sourceMappingURL=api-error.js.map