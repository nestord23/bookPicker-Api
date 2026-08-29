import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

interface TagBody {
  name?: unknown;
}

/** Valida el cuerpo para crear o actualizar un tag. Requiere `name` no vacio. */
export function validateTag(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as TagBody;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    next(ApiError.badRequest("El nombre del tag es obligatorio"));
    return;
  }

  req.body = { name };
  next();
}
