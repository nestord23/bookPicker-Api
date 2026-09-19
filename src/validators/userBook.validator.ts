import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";
import type { ReadingStatus } from "../types/userBook.types.js";

const VALID_STATUS: ReadingStatus[] = ["to_read", "reading", "read"];
const MIN_RATING = 1;
const MAX_RATING = 5;
const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

function isReadingStatus(value: unknown): value is ReadingStatus {
  return (
    typeof value === "string" && (VALID_STATUS as string[]).includes(value)
  );
}

function isRating(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_RATING &&
    value <= MAX_RATING
  );
}

function isColor(value: unknown): value is string {
  return typeof value === "string" && COLOR_PATTERN.test(value);
}

function colorOrUndefined(value: unknown): string | undefined {
  return isColor(value) ? value : undefined;
}

/** Valida el cuerpo para agregar un libro a la biblioteca. `bookId` es obligatorio. */
export function validateAddBook(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as Record<string, unknown>;

  const bookId = typeof body.bookId === "number" ? body.bookId : NaN;
  if (!Number.isInteger(bookId) || bookId <= 0) {
    next(ApiError.badRequest("bookId es obligatorio y debe ser un numero valido"));
    return;
  }
  if (body.status !== undefined && !isReadingStatus(body.status)) {
    next(ApiError.badRequest(`status debe ser uno de: ${VALID_STATUS.join(", ")}`));
    return;
  }
  if (body.rating !== undefined && !isRating(body.rating)) {
    next(
      ApiError.badRequest(`rating debe ser un entero entre ${MIN_RATING} y ${MAX_RATING}`),
    );
    return;
  }
  if (body.color !== undefined && !isColor(body.color)) {
    next(ApiError.badRequest("color debe ser un hex valido (ej: #FFD500)"));
    return;
  }

  req.body = {
    bookId,
    status: body.status,
    rating: body.rating,
    review: typeof body.review === "string" ? body.review : undefined,
    color: colorOrUndefined(body.color),
  };
  next();
}

/** Valida el cuerpo para actualizar un registro de la biblioteca. Todos opcionales. */
export function validateUpdateUserBook(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const body = req.body as Record<string, unknown>;

  if (body.status !== undefined && !isReadingStatus(body.status)) {
    next(ApiError.badRequest(`status debe ser uno de: ${VALID_STATUS.join(", ")}`));
    return;
  }
  if (body.rating !== undefined && !isRating(body.rating)) {
    next(
      ApiError.badRequest(`rating debe ser un entero entre ${MIN_RATING} y ${MAX_RATING}`),
    );
    return;
  }
  if (body.color !== undefined && !isColor(body.color)) {
    next(ApiError.badRequest("color debe ser un hex valido (ej: #FFD500)"));
    return;
  }

  req.body = {
    status: body.status,
    rating: body.rating,
    review: typeof body.review === "string" ? body.review : undefined,
    color: colorOrUndefined(body.color),
  };
  next();
}
