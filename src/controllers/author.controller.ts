import type { NextFunction, Request, Response } from "express";
import {
  createAuthor,
  deleteAuthor,
  getAuthor,
  listAuthors,
  updateAuthor,
} from "../services/author.service.js";
import { parseId } from "../utils/route.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await listAuthors();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    const data = await getAuthor(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createAuthor(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    const data = await updateAuthor(id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    await deleteAuthor(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}