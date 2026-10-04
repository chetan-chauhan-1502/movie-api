const express = require("express");
const cors = require("cors");
const movies = require("./movies.json");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Movie API is online", version: "1.0.0" });
});

// GET /api/movies (supports optional ?genre=Sci-Fi or ?search=Inception)
app.get("/api/movies", (req, res) => {
  const { genre, search } = req.query;
  let filteredMovies = [...movies];

  if (genre) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
    );
  }

  if (search) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  res.status(200).json({
    total: filteredMovies.length,
    data: filteredMovies,
  });
});

// GET /api/movies/:id
app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === req.params.id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.status(200).json(movie);
});

// Listen on dynamic host & port for cloud environments
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
