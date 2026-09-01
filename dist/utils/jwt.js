import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
const TOKEN_OPTIONS = {
    expiresIn: config.jwt.expiresIn,
};
/**
 * Firma un token JWT con el payload del usuario autenticado.
 * Unico punto que conoce el secreto y la opciones de firma.
 */
export function signToken(payload) {
    return jwt.sign(payload, config.jwt.secret, TOKEN_OPTIONS);
}
/**
 * Valida y decodifica un token JWT firmado por la aplicacion.
 *
 * @returns El payload del token, o null si el token es invalido o expiro.
 */
export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        return decoded;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=jwt.js.map