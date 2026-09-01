import { ApiError } from "../utils/api-error.js";
/** valida el cuerpo para crear o actualizar a un autor. Requiere "name" */
export function validateAuthor(req, _res, next) {
    const body = req.body;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
        next(ApiError.badRequest("El nombre del autor es obligatorio"));
        return;
    }
    req.body = {
        name,
        biography: typeof body.biography === "string" ? body.biography : undefined,
        birthDate: typeof body.birthDate === "string" ? body.birthDate : undefined,
        nationality: typeof body.nationality === "string" ? body.nationality : undefined,
    };
    next();
}
//# sourceMappingURL=author.validator.js.map