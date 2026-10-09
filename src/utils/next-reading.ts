/**
 * Seleccion aleatoria de la proxima lectura.
 *
 * Logica pura: no conoce Prisma ni HTTP, por lo que es facil de razonar y
 * testear. La estrategia evita encadenar lecturas con el mismo genero o los
 * mismos tags que la lectura en curso / ultima terminada.
 */

/** Huella de un libro usada para decidir si "repite" respecto a otra lectura. */
export interface ReadingFingerprint {
  genre: string | null;
  tagIds: readonly number[];
}

/** Referencia de lo que el usuario esta leyendo o acaba de leer. */
export interface ReadingReference {
  genres: readonly (string | null)[];
  tagIds: readonly number[];
}

/** Normaliza el genero para comparar sin depender del formato (mayus/espacios). */
function normalizeGenre(genre: string): string {
  return genre.trim().toLowerCase();
}

/** Construye el conjunto de generos de referencia ya normalizados. */
function normalizeGenres(genres: readonly (string | null)[]): Set<string> {
  const normalized = genres
    .filter((genre): genre is string => genre !== null && genre.trim() !== "")
    .map(normalizeGenre);
  return new Set(normalized);
}

/**
 * Elige aleatoriamente un candidato intentando, en este orden:
 *  1. No repetir ni genero ni tags de la referencia.
 *  2. No repetir genero (permitiendo coincidir en tags).
 *  3. Cualquier candidato, si los filtros anteriores dejan la lista vacia.
 *
 * @param candidates Libros por leer entre los que elegir.
 * @param reference Huella del libro en curso / ultimo leido.
 * @param random Fuente de aleatoriedad inyectable (por defecto `Math.random`).
 * @returns El candidato elegido o `null` si no hay candidatos.
 */
export function pickNextReading<T extends ReadingFingerprint>(
  candidates: readonly T[],
  reference: ReadingReference,
  random: () => number = Math.random,
): T | null {
  if (candidates.length === 0) return null;

  const referenceGenres = normalizeGenres(reference.genres);
  const referenceTagIds = new Set(reference.tagIds);

  const avoidsGenre = (candidate: T): boolean =>
    candidate.genre === null ||
    !referenceGenres.has(normalizeGenre(candidate.genre));

  const avoidsTags = (candidate: T): boolean =>
    candidate.tagIds.every((tagId) => !referenceTagIds.has(tagId));

  const noRepeat = candidates.filter(
    (candidate) => avoidsGenre(candidate) && avoidsTags(candidate),
  );
  const genreSafe = candidates.filter(avoidsGenre);
  const pool = noRepeat.length > 0 ? noRepeat : genreSafe.length > 0 ? genreSafe : candidates;

  const index = Math.floor(random() * pool.length);
  const safeIndex = Math.min(index, pool.length - 1);
  return pool[safeIndex] ?? null;
}
