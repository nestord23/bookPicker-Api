import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import {
  pickNextReading as selectNextReading,
  type ReadingFingerprint,
  type ReadingReference,
} from "../utils/next-reading.js";
import type {
  AddBookInput,
  NextReadingResponse,
  ReadingStatus,
  UpdateUserBookInput,
  UserBookResponse,
} from "../types/userBook.types.js";

const USER_BOOK_SELECT = {
  id: true,
  status: true,
  rating: true,
  review: true,
  color: true,
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

const NEXT_READING_SELECT = {
  id: true,
  status: true,
  rating: true,
  review: true,
  color: true,
  addedAt: true,
  updatedAt: true,
  book: {
    select: {
      id: true,
      title: true,
      description: true,
      publishYear: true,
      genre: true,
      coverImage: true,
      author: { select: { id: true, name: true } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
    },
  },
} as const;

const READING_REFERENCE_SELECT = {
  status: true,
  book: {
    select: {
      genre: true,
      tags: { select: { tag: { select: { id: true } } } },
    },
  },
} as const;

interface NextReadingEntry {
  id: number;
  status: string;
  rating: number | null;
  review: string | null;
  color: string | null;
  addedAt: Date;
  updatedAt: Date;
  book: {
    id: number;
    title: string;
    description: string | null;
    publishYear: number | null;
    genre: string | null;
    coverImage: string | null;
    author: { id: number; name: string } | null;
    tags: { tag: { id: number; name: string } }[];
  };
}

interface NextReadingCandidate extends ReadingFingerprint {
  entry: NextReadingEntry;
}

function toUserBookResponse(entry: {
  id: number;
  status: string;
  rating: number | null;
  review: string | null;
  color: string | null;
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
    color: entry.color,
    addedAt: entry.addedAt,
    updatedAt: entry.updatedAt,
    book: entry.book,
  };
}

function toNextReadingResponse(entry: NextReadingEntry): NextReadingResponse {
  return {
    id: entry.id,
    status: entry.status as ReadingStatus,
    rating: entry.rating,
    review: entry.review,
    color: entry.color,
    addedAt: entry.addedAt,
    updatedAt: entry.updatedAt,
    book: {
      id: entry.book.id,
      title: entry.book.title,
      description: entry.book.description,
      publishYear: entry.book.publishYear,
      genre: entry.book.genre,
      coverImage: entry.book.coverImage,
      author: entry.book.author,
      tags: entry.book.tags.map((t) => t.tag),
    },
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

/**
 * Elige aleatoriamente el proximo libro a leer entre los marcados como `to_read`.
 *
 * Para no encadenar lecturas similares, descarta los candidatos que repiten
 * genero o tags del libro en curso o del ultimo leido. Si el filtro deja la
 * lista vacia, va relajando las restricciones (ver `selectNextReading`).
 *
 * @throws 404 si el usuario no tiene libros pendientes por leer.
 */
export async function pickNextReading(
  userId: number,
): Promise<NextReadingResponse> {
  const entries = await prisma.userBook.findMany({
    where: { userId, status: "to_read" },
    select: NEXT_READING_SELECT,
  });
  if (entries.length === 0) {
    throw ApiError.notFound("No tienes libros en tu lista de proximas lecturas");
  }

  const candidates: NextReadingCandidate[] = entries.map((entry) => ({
    entry,
    genre: entry.book.genre,
    tagIds: entry.book.tags.map((t) => t.tag.id),
  }));

  const reference = await getReadingReference(userId);
  const chosen = selectNextReading(candidates, reference);
  // `chosen` no puede ser null: ya se verifico que hay candidatos.
  return toNextReadingResponse(chosen!.entry);
}

/** Huella (generos + tags) del libro en curso y del ultimo leido por el usuario. */
async function getReadingReference(userId: number): Promise<ReadingReference> {
  const entries = await prisma.userBook.findMany({
    where: { userId, status: { in: ["reading", "read"] } },
    select: READING_REFERENCE_SELECT,
    orderBy: { updatedAt: "desc" },
  });

  const inProgress = entries.find((entry) => entry.status === "reading");
  const lastRead = entries.find((entry) => entry.status === "read");

  const genres: (string | null)[] = [];
  const tagIds: number[] = [];
  for (const entry of [inProgress, lastRead]) {
    if (!entry) continue;
    genres.push(entry.book.genre);
    for (const bookTag of entry.book.tags) {
      tagIds.push(bookTag.tag.id);
    }
  }
  return { genres, tagIds };
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
      color: input.color,
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
      color: input.color,
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
