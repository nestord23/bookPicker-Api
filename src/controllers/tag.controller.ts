import type { NextFunction, Request, Response } from "express";
import {
  createTag,
  deleteTag,
  getTag,
  listTags,
  updateTag,
} from "../services/tag.service.js";
import { parseId } from "../utils/route.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await listTags();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    const data = await getTag(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await createTag(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    const data = await updateTag(id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id, res);
  if (id === null) return;
  try {
    await deleteTag(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
