/** Tipos de entrada/salida de la entidad UserBook (biblioteca personal). */

/** Estados validos de la biblioteca personal (coincide con el campo status). */
export type ReadingStatus = "to_read" | "reading" | "read";

export interface AddBookInput {
  bookId: number;
  status?: ReadingStatus;
  rating?: number;
  review?: string;
  color?: string;
}

export interface UpdateUserBookInput {
  status?: ReadingStatus;
  rating?: number;
  review?: string;
  color?: string;
}

export interface UserBookResponse {
  id: number;
  status: ReadingStatus;
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
}

/** Detalle ampliado del libro elegido como proxima lectura (incluye tags y portada). */
export interface NextReadingBook {
  id: number;
  title: string;
  description: string | null;
  publishYear: number | null;
  genre: string | null;
  coverImage: string | null;
  author: { id: number; name: string } | null;
  tags: { id: number; name: string }[];
}

export interface NextReadingResponse {
  id: number;
  status: ReadingStatus;
  rating: number | null;
  review: string | null;
  color: string | null;
  addedAt: Date;
  updatedAt: Date;
  book: NextReadingBook;
}
