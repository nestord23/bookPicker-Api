import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/api-error.js";
import type { UserRole } from "../types/jwt.types.js";

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

/**
 * Autentica el token Bearer y adjunta el usuario autenticado a `req.user`.
 * Rechaza la peticion si el token falta o es invalido.
 */
export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = extractBearerToken(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    next(ApiError.unauthorized("Token de autenticacion invalido o ausente"));
    return;
  }

  req.user = { userId: payload.userId, role: payload.role };
  next();
}

/**
 * Autoriza a los roles indicados para acceder a la ruta.
 * Debe usarse DESPUES de requireAuth, que ya pobla `req.user`.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      next(ApiError.forbidden("No tienes permisos para esta accion"));
      return;
    }
    next();
  };
}
