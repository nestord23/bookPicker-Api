/** Tipos de entrada/salida de la entidad Author. */

export interface CreateAuthorInput {
  name: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
}

export interface UpdateAuthorInput {
  name?: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
}

export interface AuthorResponse {
  id: number;
  name: string;
  biography: string | null;
  birthDate: Date | null;
  nationality: string | null;
}
