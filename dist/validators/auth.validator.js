import { ApiError } from "../utils/api-error.js";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
/**
 * Valida el cuerpo de /auth/register.
 * Asegura que email y password existan y tengan formato valido.
 */
export function validateRegister(req, _res, next) {
    const body = req.body;
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = body.password;
    if (!EMAIL_PATTERN.test(email)) {
        next(ApiError.badRequest("Email invalido"));
        return;
    }
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
        next(ApiError.badRequest(`La contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`));
        return;
    }
    req.body = { name: body.name, email, password };
    next();
}
/**
 * Valida el cuerpo de /auth/login.
 * Email y password son obligatorios.
 */
export function validateLogin(req, _res, next) {
    const body = req.body;
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = body.password;
    if (!EMAIL_PATTERN.test(email)) {
        next(ApiError.badRequest("Email invalido"));
        return;
    }
    if (typeof password !== "string" || password.length === 0) {
        next(ApiError.badRequest("La contrasena es obligatoria"));
        return;
    }
    req.body = { email, password };
    next();
}
//# sourceMappingURL=auth.validator.js.map