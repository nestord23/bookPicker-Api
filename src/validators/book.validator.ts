import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

interface BookBody {
  title?: unknown;
  description?: unknown;
  publishYear?: unknown;
  genre?: unknown;
  coverImage?: unknown;
  authorId?: unknown;
  tagIds?: unknown;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function toIdArray(value: unknown): number[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) return undefined;
  return value.filter((v): v is number => typeof v === "number");
}

/** Valida el cuerpo de un libro. `title` es obligatorio. */
export function validateBook(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as BookBody;

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    next(ApiError.badRequest("El titulo del libro es obligatorio"));
    return;
  }

  req.body = {
    title,
    description: toOptionalString(body.description),
    publishYear: toOptionalNumber(body.publishYear),
    genre: toOptionalString(body.genre),
    coverImage: toOptionalString(body.coverImage),
    authorId: toOptionalNumber(body.authorId),
    tagIds: toIdArray(body.tagIds),
  };
  next();
}
