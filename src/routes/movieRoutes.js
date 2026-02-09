import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/rbacMiddleware.js";
import { addMovie, removeMovie, listMovies, getTmdbPopularMovies } from "../controllers/movieController.js";

const router = Router();

// TMDB popular movies (public, but requires auth for track)
router.get("/tmdb/popular", requireAuth, getTmdbPopularMovies);

router.get("/", requireAuth, listMovies);
// admin only
router.post("/", requireAuth, requireRole("admin"), addMovie);
router.delete("/:id", requireAuth, requireRole("admin"), removeMovie);

export default router;
