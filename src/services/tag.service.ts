import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import type { CreateTagInput, TagResponse, UpdateTagInput } from "../types/tag.types.js";

/** Normaliza el nombre del tag para comparar y almacenar de forma consistente. */
function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/** Verifica que no exista otro tag con el mismo nombre (case-sensitive). */
async function assertNameAvailable(name: string, exceptId?: number): Promise<void> {
  const existing = await prisma.tag.findUnique({ where: { name } });
  if (existing && existing.id !== exceptId) {
    throw ApiError.conflict("Ya existe un tag con este nombre");
  }
}

function toTagResponse(tag: { id: number; name: string }): TagResponse {
  return { id: tag.id, name: tag.name };
}

/** Lista todos los tags. */
export async function listTags(): Promise<TagResponse[]> {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return tags.map(toTagResponse);
}

/** Obtiene un tag por id o lanza 404. */
export async function getTag(id: number): Promise<TagResponse> {
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) {
    throw ApiError.notFound("Tag no encontrado");
  }
  return toTagResponse(tag);
}

/** Crea un tag nuevo. Rechaza nombres duplicados. */
export async function createTag(input: CreateTagInput): Promise<TagResponse> {
  const name = normalizeName(input.name);
  await assertNameAvailable(name);

  const tag = await prisma.tag.create({ data: { name } });
  return toTagResponse(tag);
}

/** Actualiza un tag existente o lanza 404. Rechaza nombres duplicados. */
export async function updateTag(
  id: number,
  input: UpdateTagInput,
): Promise<TagResponse> {
  await tagExistsOrThrow(id);

  const name = input.name !== undefined ? normalizeName(input.name) : undefined;
  if (name !== undefined) {
    await assertNameAvailable(name, id);
  }

  const tag = await prisma.tag.update({ where: { id }, data: { name } });
  return toTagResponse(tag);
}

/** Elimina un tag y sus relaciones BookTag (en cascada). */
export async function deleteTag(id: number): Promise<void> {
  await tagExistsOrThrow(id);
  await prisma.tag.delete({ where: { id } });
}

/** Lanza 404 si el tag no existe. */
async function tagExistsOrThrow(id: number): Promise<void> {
  const count = await prisma.tag.count({ where: { id } });
  if (count === 0) {
    throw ApiError.notFound("Tag no encontrado");
  }
}
