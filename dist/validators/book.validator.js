import { ApiError } from "../utils/api-error.js";
function toOptionalString(value) {
    return typeof value === "string" ? value : undefined;
}
function toOptionalNumber(value) {
    return typeof value === "number" ? value : undefined;
}
function toIdArray(value) {
    if (value === undefined || value === null)
        return undefined;
    if (!Array.isArray(value))
        return undefined;
    return value.filter((v) => typeof v === "number");
}
/** Valida el cuerpo de un libro. `title` es obligatorio. */
export function validateBook(req, _res, next) {
    const body = req.body;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
        next(ApiError.badRequest("El titulo del libro es obligatorio"));
        return;
    }
    req.body = {
        title,
        description: toOptionalString(body.description),
        publishYear: toOptionalNumber(body.publishYear),
        genre: toOptionalString(body.genre),
        coverImage: toOptionalString(body.coverImage),
        authorId: toOptionalNumber(body.authorId),
        tagIds: toIdArray(body.tagIds),
    };
    next();
}
//# sourceMappingURL=book.validator.js.map