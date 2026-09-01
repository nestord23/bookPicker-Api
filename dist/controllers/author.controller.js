import { createAuthor, deleteAuthor, getAuthor, listAuthors, updateAuthor, } from "../services/author.service.js";
import { parseId } from "../utils/route.js";
export async function list(req, res, next) {
    try {
        const data = await listAuthors();
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function getOne(req, res, next) {
    const id = parseId(req.params.id, res);
    if (id === null)
        return;
    try {
        const data = await getAuthor(id);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function create(req, res, next) {
    try {
        const data = await createAuthor(req.body);
        res.status(201).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function update(req, res, next) {
    const id = parseId(req.params.id, res);
    if (id === null)
        return;
    try {
        const data = await updateAuthor(id, req.body);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    const id = parseId(req.params.id, res);
    if (id === null)
        return;
    try {
        await deleteAuthor(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=author.controller.js.map