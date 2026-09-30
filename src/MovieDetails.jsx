
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMovies } from "./api";
import "./App.css";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        setError("");

        const movies = await fetchMovies();

        const selectedMovie = movies.find(
          (item) => item.appId === id
        );

        if (!selectedMovie) {
          throw new Error("Movie not found.");
        }

        setMovie(selectedMovie);
      } catch (err) {
        setError(err.message || "Unable to load movie details.");
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="details-page status-message">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="details-page status-message">
        <h2>Unable to show this movie</h2>
        <p>{error || "Movie not found."}</p>

        <Link to="/" className="back-button">
          ← Back to movies
        </Link>
      </div>
    );
  }

  return (
    <main className="details-page">
      <Link to="/" className="back-button">
        ← Back to movies
      </Link>

      <section className="details-card">
        <div className="details-image">
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
            />
          ) : (
            <div className="no-poster">
              🎬 No image available
            </div>
          )}
        </div>

        <div className="details-content">
          <p className="eyebrow">MOVIE DETAILS</p>

          <h1>{movie.title}</h1>

          <div className="details-meta">
            {movie.rating != null && (
              <span>⭐ {movie.rating}</span>
            )}

            {movie.year && <span>{movie.year}</span>}

            <span>{movie.categoryName}</span>
          </div>

          <h2>Overview</h2>

          <p className="overview">
            {movie.description ||
              "A description is not available in this dataset."}
          </p>

          {movie.imdbId && (
            <p>
              <strong>IMDb ID:</strong> {movie.imdbId}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;