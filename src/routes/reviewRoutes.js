import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validate, validateParams } from "../middleware/validate.js";
import {
  createReview, listMyReviews, getReviewById, updateReview, deleteReview
} from "../controllers/reviewController.js";
import { reviewCreateSchema, reviewUpdateSchema, reviewIdParamSchema } from "./schemas.js";

const router = Router();

router.post("/", requireAuth, validate(reviewCreateSchema), createReview);
router.get("/", requireAuth, listMyReviews);
router.get("/:id", requireAuth, validateParams(reviewIdParamSchema), getReviewById);
router.put("/:id", requireAuth, validateParams(reviewIdParamSchema), validate(reviewUpdateSchema), updateReview);
router.delete("/:id", requireAuth, validateParams(reviewIdParamSchema), deleteReview);

export default router;
