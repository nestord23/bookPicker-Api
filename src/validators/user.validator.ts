import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";
import type { UserRole } from "../types/jwt.types.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const VALID_ROLES: UserRole[] = ["user", "admin"];

interface UpdateProfileBody {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  currentPassword?: unknown;
}

interface UpdateRoleBody {
  role?: unknown;
}

/**
 * Valida el cuerpo para actualizar el perfil propio.
 * Reglas: email valido, password con longitud minima, ambas opcionales.
 * El password y email solo se aplican si se confirmo currentPassword.
 */
export function validateUpdateProfile(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as UpdateProfileBody;

  const result: {
    name?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
  } = {
    currentPassword:
      typeof body.currentPassword === "string" ? body.currentPassword : undefined,
  };

  if (body.name !== undefined) {
    result.name = typeof body.name === "string" ? body.name.trim() : undefined;
  }

  if (body.email !== undefined) {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!EMAIL_PATTERN.test(email)) {
      next(ApiError.badRequest("Email invalido"));
      return;
    }
    result.email = email;
  }

  if (body.password !== undefined) {
    const password = body.password;
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      next(
        ApiError.badRequest(
          `La contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
        ),
      );
      return;
    }
    result.password = password;
  }

  if ((result.email !== undefined || result.password !== undefined) && !result.currentPassword) {
    next(ApiError.badRequest("Debes confirmar tu contrasena actual"));
    return;
  }

  req.body = result;
  next();
}

/** Valida el cuerpo para que un admin cambie el rol de un usuario. */
export function validateUpdateRole(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as UpdateRoleBody;

  if (typeof body.role !== "string" || !(VALID_ROLES as string[]).includes(body.role)) {
    next(ApiError.badRequest(`role debe ser uno de: ${VALID_ROLES.join(", ")}`));
    return;
  }

  req.body = { role: body.role as UserRole };
  next();
}
