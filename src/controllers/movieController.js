import Movie from "../models/Movie.js";
import mongoose from "mongoose";

// Fetch popular movies from TMDB API
export async function getTmdbPopularMovies(req, res, next) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "TMDB API key not configured" });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    );

    if (!response.ok) {
      return res.status(response.status).json({ message: "Failed to fetch from TMDB" });
    }

    const data = await response.json();
    const movies = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      genreIds: movie.genre_ids,
    }));

    return res.json({ movies, source: "TMDB" });
  } catch (err) {
    next(err);
  }
}

export async function addMovie(req, res, next) {
  try {
    const { movieId, title, description } = req.body;
    if (!movieId || !title) return res.status(400).json({ message: "movieId and title required" });

    const exists = await Movie.findOne({ movieId });
    if (exists) return res.status(409).json({ message: "Movie already exists" });

    const movie = await Movie.create({ movieId, title, description, createdBy: req.user._id });
    return res.status(201).json({ message: "Movie added", movie });
  } catch (err) { next(err); }
}

export async function removeMovie(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid movie id" });

    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    return res.json({ message: "Movie removed" });
  } catch (err) { next(err); }
}

export async function listMovies(req, res, next) {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    return res.json({ movies });
  } catch (err) { next(err); }
}
