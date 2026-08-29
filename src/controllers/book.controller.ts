import type { NextFunction, Request, Response } from "express";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "../services/book.service.js";
import { parseId } from "../utils/route.js";

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
