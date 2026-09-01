import { Router } from "express";
import * as userBookController from "../controllers/userBook.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateAddBook, validateUpdateUserBook, } from "../validators/userBook.validator.js";
const router = Router();
router.use(requireAuth);
router.get("/", userBookController.list);
router.post("/", validateAddBook, userBookController.add);
router.get("/:bookId", userBookController.getOne);
router.patch("/:bookId", validateUpdateUserBook, userBookController.update);
router.delete("/:bookId", userBookController.remove);
export default router;
//# sourceMappingURL=userBook.routes.js.map