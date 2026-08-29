/** Tipos de entrada/salida de la entidad UserBook (biblioteca personal). */

/** Estados validos de la biblioteca personal (coincide con el campo status). */
export type ReadingStatus = "to_read" | "reading" | "read";

export interface AddBookInput {
  bookId: number;
  status?: ReadingStatus;
  rating?: number;
  review?: string;
}

export interface UpdateUserBookInput {
  status?: ReadingStatus;
  rating?: number;
  review?: string;
}

export interface UserBookResponse {
  id: number;
  status: ReadingStatus;
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
}
