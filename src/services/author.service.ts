import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import type {
  AuthorResponse,
  CreateAuthorInput,
  UpdateAuthorInput,
} from "../types/author.types.js";

/** Normaliza y mapea un autor del schema al tipo de respuesta. */
function toAuthorResponse(author: {
  id: number;
  name: string;
  biography: string | null;
  birthDate: Date | null;
  nationality: string | null;
}): AuthorResponse {
  return {
    id: author.id,
    name: author.name,
    biography: author.biography,
    birthDate: author.birthDate,
    nationality: author.nationality,
  };
}

/** Lista todos los autores. */
export async function listAuthors(): Promise<AuthorResponse[]> {
  const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });
  return authors.map(toAuthorResponse);
}

/** Obtiene un autor por id o lanza 404. */
export async function getAuthor(id: number): Promise<AuthorResponse> {
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) {
    throw ApiError.notFound("Autor no encontrado");
  }
  return toAuthorResponse(author);
}

/** Crea un autor nuevo. */
export async function createAuthor(
  input: CreateAuthorInput,
): Promise<AuthorResponse> {
  const author = await prisma.author.create({
    data: {
      name: input.name,
      biography: input.biography,
      birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
      nationality: input.nationality,
    },
  });
  return toAuthorResponse(author);
}

/** Actualiza un autor existente o lanza 404. */
export async function updateAuthor(
  id: number,
  input: UpdateAuthorInput,
): Promise<AuthorResponse> {
  authorExistsOrThrow(id);

  const author = await prisma.author.update({
    where: { id },
    data: {
      name: input.name,
      biography: input.biography,
      birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
      nationality: input.nationality,
    },
  });
  return toAuthorResponse(author);
}

/** Elimina un autor o lanza 404. */
export async function deleteAuthor(id: number): Promise<void> {
  await authorExistsOrThrow(id);
  await prisma.author.delete({ where: { id } });
}

/** Lanza 404 si el autor no existe. */
async function authorExistsOrThrow(id: number): Promise<void> {
  const count = await prisma.author.count({ where: { id } });
  if (count === 0) {
    throw ApiError.notFound("Autor no encontrado");
  }
}