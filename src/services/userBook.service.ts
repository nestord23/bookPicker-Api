import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import type {
  AddBookInput,
  ReadingStatus,
  UpdateUserBookInput,
  UserBookResponse,
} from "../types/userBook.types.js";

const USER_BOOK_SELECT = {
  id: true,
  status: true,
  rating: true,
  review: true,
  addedAt: true,
  updatedAt: true,
  book: {
    select: {
      id: true,
      title: true,
      description: true,
      publishYear: true,
      genre: true,
    },
  },
} as const;

function toUserBookResponse(entry: {
  id: number;
  status: string;
  rating: number | null;
  review: string | null;
  addedAt: Date;
  updatedAt: Date;
  book: {
    id: number;
    title: string;
    description: string | null;
    publishYear: number | null;
    genre: string | null;
  };
}): UserBookResponse {
  return {
    id: entry.id,
    status: entry.status as ReadingStatus,
    rating: entry.rating,
    review: entry.review,
    addedAt: entry.addedAt,
    updatedAt: entry.updatedAt,
    book: entry.book,
  };
}

/** Lista los libros de la biblioteca de un usuario, con filtro opcional por status. */
export async function listUserBooks(
  userId: number,
  status?: ReadingStatus,
): Promise<UserBookResponse[]> {
  const entries = await prisma.userBook.findMany({
    where: { userId, ...(status ? { status } : {}) },
    select: USER_BOOK_SELECT,
    orderBy: { addedAt: "desc" },
  });
  return entries.map(toUserBookResponse);
}

/** Devuelve el registro de un libro en la biblioteca del usuario, o 404. */
export async function getUserBook(
  userId: number,
  bookId: number,
): Promise<UserBookResponse> {
  const entry = await getUserBookOrThrow(userId, bookId);
  return toUserBookResponse(entry);
}

/** Agrega un libro a la biblioteca del usuario. 404 si el libro no existe, 409 si ya esta. */
export async function addBookToLibrary(
  userId: number,
  input: AddBookInput,
): Promise<UserBookResponse> {
  const book = await prisma.book.findUnique({
    where: { id: input.bookId },
    select: { id: true },
  });
  if (!book) {
    throw ApiError.notFound("Libro no encontrado");
  }

  const existing = await prisma.userBook.findUnique({
    where: { userId_bookId: { userId, bookId: input.bookId } },
  });
  if (existing) {
    throw ApiError.conflict("Este libro ya esta en tu biblioteca");
  }

  const entry = await prisma.userBook.create({
    data: {
      userId,
      bookId: input.bookId,
      status: input.status ?? "to_read",
      rating: input.rating,
      review: input.review,
    },
    select: USER_BOOK_SELECT,
  });
  return toUserBookResponse(entry);
}

/** Actualiza status/rating/review de un libro en la biblioteca, o 404. */
export async function updateUserBook(
  userId: number,
  bookId: number,
  input: UpdateUserBookInput,
): Promise<UserBookResponse> {
  await getUserBookOrThrow(userId, bookId);

  const entry = await prisma.userBook.update({
    where: { userId_bookId: { userId, bookId } },
    data: {
      status: input.status,
      rating: input.rating ?? null,
      review: input.review,
    },
    select: USER_BOOK_SELECT,
  });
  return toUserBookResponse(entry);
}

/** Elimina un libro de la biblioteca del usuario, o 404. */
export async function deleteUserBook(
  userId: number,
  bookId: number,
): Promise<void> {
  await getUserBookOrThrow(userId, bookId);
  await prisma.userBook.delete({
    where: { userId_bookId: { userId, bookId } },
  });
}

/** Obtiene el registro de un libro del usuario o lanza 404. */
async function getUserBookOrThrow(userId: number, bookId: number) {
  const entry = await prisma.userBook.findUnique({
    where: { userId_bookId: { userId, bookId } },
    select: USER_BOOK_SELECT,
  });
  if (!entry) {
    throw ApiError.notFound("Este libro no esta en tu biblioteca");
  }
  return entry;
}
