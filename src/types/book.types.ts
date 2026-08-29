/** Tipos de entrada/salida de la entidad Book. */

export interface CreateBookInput {
  title: string;
  description?: string;
  publishYear?: number;
  genre?: string;
  coverImage?: string;
  authorId?: number;
  tagIds?: number[];
}

export interface UpdateBookInput {
  title?: string;
  description?: string;
  publishYear?: number;
  genre?: string;
  coverImage?: string;
  authorId?: number;
  tagIds?: number[];
}

export interface BookResponse {
  id: number;
  title: string;
  description: string | null;
  publishYear: number | null;
  genre: string | null;
  coverImage: string | null;
  author: { id: number; name: string } | null;
  tags: { id: number; name: string }[];
}
