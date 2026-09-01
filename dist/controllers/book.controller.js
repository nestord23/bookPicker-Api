import { createBook, deleteBook, getBook, listBooks, updateBook, } from "../services/book.service.js";
import { parseId } from "../utils/route.js";
export async function list(req, res, next) {
    try {
        const data = await listBooks();
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
        const data = await getBook(id);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function create(req, res, next) {
    try {
        const data = await createBook(req.body);
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
        const data = await updateBook(id, req.body);
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
        await deleteBook(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=book.controller.js.map