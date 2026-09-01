import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { publishBook } from "../ws/index.js";
const BOOK_SELECT = {
    id: true,
    title: true,
    description: true,
    publishYear: true,
    genre: true,
    coverImage: true,
    author: { select: { id: true, name: true } },
    tags: { select: { tag: { select: { id: true, name: true } } } },
};
function toBookResponse(book) {
    return {
        id: book.id,
        title: book.title,
        description: book.description,
        publishYear: book.publishYear,
        genre: book.genre,
        coverImage: book.coverImage,
        author: book.author,
        tags: book.tags.map((t) => t.tag),
    };
}
/** Lista todos los libros. */
export async function listBooks() {
    const books = await prisma.book.findMany({
        select: BOOK_SELECT,
        orderBy: { title: "asc" },
    });
    return books.map(toBookResponse);
}
/** Obtiene un libro por id o lanza 404. */
export async function getBook(id) {
    const book = await prisma.book.findUnique({
        where: { id },
        select: BOOK_SELECT,
    });
    if (!book) {
        throw ApiError.notFound("Libro no encontrado");
    }
    return toBookResponse(book);
}
/** Convierte los ids de tags a la forma de creacion anidada que Prisma espera. */
function connectTags(tagIds) {
    if (!tagIds)
        return undefined;
    return { create: tagIds.map((id) => ({ tag: { connect: { id } } })) };
}
/** Crea un libro y le asocia autor y tags. */
export async function createBook(input) {
    const book = await prisma.book.create({
        data: {
            title: input.title,
            description: input.description,
            publishYear: input.publishYear,
            genre: input.genre,
            coverImage: input.coverImage,
            author: input.authorId ? { connect: { id: input.authorId } } : undefined,
            tags: connectTags(input.tagIds),
        },
        select: BOOK_SELECT,
    });
    const response = toBookResponse(book);
    publishBook("BOOK_CREATED", response);
    return response;
}
/** Actualiza un libro existente o lanza 404.
 * Si se envian tagIds, estos reemplazan por completo los tags actuales del libro. */
export async function updateBook(id, input) {
    await bookExistsOrThrow(id);
    if (input.tagIds) {
        await prisma.bookTag.deleteMany({ where: { bookId: id } });
    }
    const book = await prisma.book.update({
        where: { id },
        data: {
            title: input.title,
            description: input.description,
            publishYear: input.publishYear,
            genre: input.genre,
            coverImage: input.coverImage,
            author: input.authorId ? { connect: { id: input.authorId } } : undefined,
            tags: connectTags(input.tagIds),
        },
        select: BOOK_SELECT,
    });
    const response = toBookResponse(book);
    publishBook("BOOK_UPDATED", response);
    return response;
}
/** Elimina un libro o lanza 404. */
export async function deleteBook(id) {
    await bookExistsOrThrow(id);
    await prisma.book.delete({ where: { id } });
    publishBook("BOOK_DELETED", { id });
}
/** Lanza 404 si el libro no existe. */
async function bookExistsOrThrow(id) {
    const count = await prisma.book.count({ where: { id } });
    if (count === 0) {
        throw ApiError.notFound("Libro no encontrado");
    }
}
//# sourceMappingURL=book.service.js.map