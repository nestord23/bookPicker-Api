import { ApiError } from "../utils/api-error.js";
const VALID_STATUS = ["to_read", "reading", "read"];
const MIN_RATING = 1;
const MAX_RATING = 5;
function isReadingStatus(value) {
    return (typeof value === "string" && VALID_STATUS.includes(value));
}
function isRating(value) {
    return (typeof value === "number" &&
        Number.isInteger(value) &&
        value >= MIN_RATING &&
        value <= MAX_RATING);
}
/** Valida el cuerpo para agregar un libro a la biblioteca. `bookId` es obligatorio. */
export function validateAddBook(req, _res, next) {
    const body = req.body;
    const bookId = typeof body.bookId === "number" ? body.bookId : NaN;
    if (!Number.isInteger(bookId) || bookId <= 0) {
        next(ApiError.badRequest("bookId es obligatorio y debe ser un numero valido"));
        return;
    }
    if (body.status !== undefined && !isReadingStatus(body.status)) {
        next(ApiError.badRequest(`status debe ser uno de: ${VALID_STATUS.join(", ")}`));
        return;
    }
    if (body.rating !== undefined && !isRating(body.rating)) {
        next(ApiError.badRequest(`rating debe ser un entero entre ${MIN_RATING} y ${MAX_RATING}`));
        return;
    }
    req.body = {
        bookId,
        status: body.status,
        rating: body.rating,
        review: typeof body.review === "string" ? body.review : undefined,
    };
    next();
}
/** Valida el cuerpo para actualizar un registro de la biblioteca. Todos opcionales. */
export function validateUpdateUserBook(req, _res, next) {
    const body = req.body;
    if (body.status !== undefined && !isReadingStatus(body.status)) {
        next(ApiError.badRequest(`status debe ser uno de: ${VALID_STATUS.join(", ")}`));
        return;
    }
    if (body.rating !== undefined && !isRating(body.rating)) {
        next(ApiError.badRequest(`rating debe ser un entero entre ${MIN_RATING} y ${MAX_RATING}`));
        return;
    }
    req.body = {
        status: body.status,
        rating: body.rating,
        review: typeof body.review === "string" ? body.review : undefined,
    };
    next();
}
//# sourceMappingURL=userBook.validator.js.map