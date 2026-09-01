import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { publishAuthor } from "../ws/index.js";
/** Normaliza y mapea un autor del schema al tipo de respuesta. */
function toAuthorResponse(author) {
    return {
        id: author.id,
        name: author.name,
        biography: author.biography,
        birthDate: author.birthDate,
        nationality: author.nationality,
    };
}
/** Lista todos los autores. */
export async function listAuthors() {
    const authors = await prisma.author.findMany({ orderBy: { name: "asc" } });
    return authors.map(toAuthorResponse);
}
/** Obtiene un autor por id o lanza 404. */
export async function getAuthor(id) {
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
        throw ApiError.notFound("Autor no encontrado");
    }
    return toAuthorResponse(author);
}
/** Crea un autor nuevo. */
export async function createAuthor(input) {
    const author = await prisma.author.create({
        data: {
            name: input.name,
            biography: input.biography,
            birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
            nationality: input.nationality,
        },
    });
    const response = toAuthorResponse(author);
    publishAuthor("AUTHOR_CREATED", response);
    return response;
}
/** Actualiza un autor existente o lanza 404. */
export async function updateAuthor(id, input) {
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
    const response = toAuthorResponse(author);
    publishAuthor("AUTHOR_UPDATED", response);
    return response;
}
/** Elimina un autor o lanza 404. */
export async function deleteAuthor(id) {
    await authorExistsOrThrow(id);
    await prisma.author.delete({ where: { id } });
    publishAuthor("AUTHOR_DELETED", { id });
}
/** Lanza 404 si el autor no existe. */
async function authorExistsOrThrow(id) {
    const count = await prisma.author.count({ where: { id } });
    if (count === 0) {
        throw ApiError.notFound("Autor no encontrado");
    }
}
//# sourceMappingURL=author.service.js.map