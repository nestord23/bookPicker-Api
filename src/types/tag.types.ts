/** Tipos de entrada/salida de la entidad Tag. */

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name?: string;
}

export interface TagResponse {
  id: number;
  name: string;
}
