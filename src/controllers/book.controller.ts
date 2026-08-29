import type { NextFunction, Request, Response } from "express";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "../services/book.service.js";

/** Saca el id numérico del parámetro de ruta o responde 400. */
function parseId(
  id: string | string[] | undefined,
  res: Response,
): number | null {
  const raw = Array.isArray(id) ? id[0] : id;
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    res.status(400).json({ success: false, message: "Id invalido" });
    return null;
  }
  return parsed;
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await listBooks();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    const data = await getBook(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createBook(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    const data = await updateBook(id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    await deleteBook(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
