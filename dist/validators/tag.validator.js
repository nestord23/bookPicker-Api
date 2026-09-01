import { ApiError } from "../utils/api-error.js";
/** Valida el cuerpo para crear o actualizar un tag. Requiere `name` no vacio. */
export function validateTag(req, _res, next) {
    const body = req.body;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
        next(ApiError.badRequest("El nombre del tag es obligatorio"));
        return;
    }
    req.body = { name };
    next();
}
//# sourceMappingURL=tag.validator.js.map