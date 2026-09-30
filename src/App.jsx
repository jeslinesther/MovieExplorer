
import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import { fetchMovies } from "./api";
import "./App.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMovies();
        setMovies(data);
      } catch (err) {
        setError(err.message || "Unable to load movies.");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  const categories = [
    ...new Map(
      movies.map((movie) => [
        movie.categoryId,
        {
          id: movie.categoryId,
          name: movie.categoryName,
        },
      ])
    ).values(),
  ];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesGenre =
      selectedGenre === "all" ||
      movie.categoryId === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <>
      <header className="navbar">
        <Link to="/" className="logo">
          🎬 CineScope
        </Link>

        <a href="#movies" className="nav-link">
          Explore Movies
        </a>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">
            YOUR NEXT MOVIE NIGHT STARTS HERE
          </p>

          <h1>
            Discover your next
            <span> favourite movie.</span>
          </h1>

          <p className="hero-description">
            Explore movies, discover new stories,
            and find something worth watching.
          </p>

          <div className="search-box">
            <span>🔎</span>

            <input
              type="text"
              placeholder="Search for a movie..."
              aria-label="Search movies"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                className="clear-button"
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE MOVIE COLLECTION</p>
              <h2>
                {search ? "Search Results" : "Explore Movies"}
              </h2>
            </div>

            <span className="movie-count">
              {filteredMovies.length} movies
            </span>
          </div>

          <div className="genre-list">
            <button
              className={
                selectedGenre === "all"
                  ? "genre active"
                  : "genre"
              }
              onClick={() => setSelectedGenre("all")}
            >
              All Movies
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={
                  selectedGenre === category.id
                    ? "genre active"
                    : "genre"
                }
                onClick={() => setSelectedGenre(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading && (
            <div className="status-message">
              <div className="spinner"></div>
              <p>Finding amazing movies for you...</p>
            </div>
          )}

          {!loading && error && (
            <div className="status-message error-message">
              <h3>Oops! Something went wrong.</h3>
              <p>{error}</p>

              <button
                className="genre active"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredMovies.length === 0 && (
              <div className="status-message">
                <h3>No movies found 😔</h3>
                <p>Try another search or category.</p>
              </div>
            )}

          {!loading && !error && filteredMovies.length > 0 && (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <Link
                  to={`/movie/${encodeURIComponent(movie.appId)}`}
                  className="movie-card"
                  key={movie.appId}
                >
                  <div className="poster-wrapper">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        className="movie-poster"
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-poster">
                        🎬 No poster available
                      </div>
                    )}

                    {movie.rating != null && (
                      <span className="rating">
                        ⭐ {movie.rating}
                      </span>
                    )}
                  </div>

                  <div className="movie-info">
                    <h3>{movie.title}</h3>

                    <p>
                      {movie.year || "Year unavailable"}
                    </p>

                    <span className="details-link">
                      {movie.categoryName} · View details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Made with ❤️ for movie lovers.</p>
        <p>Movie data provided by SampleAPIs.</p>
      </footer>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  );
}

export default App;