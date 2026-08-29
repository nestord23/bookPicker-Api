import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

interface RegisterBody {
  name?: string;
  email?: unknown;
  password?: unknown;
}

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

/**
 * Valida el cuerpo de /auth/register.
 * Asegura que email y password existan y tengan formato valido.
 */
export function validateRegister(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as RegisterBody;
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = body.password;

  if (!EMAIL_PATTERN.test(email)) {
    next(ApiError.badRequest("Email invalido"));
    return;
  }
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    next(
      ApiError.badRequest(
        `La contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
      ),
    );
    return;
  }

  req.body = { name: body.name, email, password };
  next();
}

/**
 * Valida el cuerpo de /auth/login.
 * Email y password son obligatorios.
 */
export function validateLogin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as LoginBody;
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
