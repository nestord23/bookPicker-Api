import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

interface AuthorBody {
  name: unknown;
  biography?: unknown;
  birthDate?: unknown;
  nationality?: unknown;
}

/** valida el cuerpo para crear o actualizar a un autor. Requiere "name" */
export function validateAuthor(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as AuthorBody;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    next(ApiError.badRequest("El nombre del autor es obligatorio"));
    return;
  }
  req.body = {
    name,
    biography: typeof body.biography === "string" ? body.biography : undefined,
    birthDate: typeof body.birthDate === "string" ? body.birthDate : undefined,
    nationality:
      typeof body.nationality === "string" ? body.nationality : undefined,
  };
  next();
}
