import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../config/config.js";
import type { JwtPayload } from "../types/jwt.types.js";

const TOKEN_OPTIONS: SignOptions = {
  expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
};

/**
 * Firma un token JWT con el payload del usuario autenticado.
 * Unico punto que conoce el secreto y la opciones de firma.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.secret, TOKEN_OPTIONS);
}

/**
 * Valida y decodifica un token JWT firmado por la aplicacion.
 *
 * @returns El payload del token, o null si el token es invalido o expiro.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}
