import { Router } from "express";
import * as bookController from "../controllers/book.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validateBook } from "../validators/book.validator.js";

const router = Router();

router.get("/", requireAuth, bookController.list);
router.get("/:id", requireAuth, bookController.getOne);
router.post(
  "/",
  requireAuth,
  validateBook,
  bookController.create,
);
router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validateBook,
  bookController.update,
);
router.delete("/:id", requireAuth, requireRole("admin"), bookController.remove);

export default router;
