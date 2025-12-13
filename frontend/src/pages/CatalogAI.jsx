import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import "../App.css";

export default function CatalogAI() {
  const [search, setSearch] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  // Se submittedQuery estiver vazio, mostramos trending.
  const mode = submittedQuery ? "search" : "trending";

  const { movies, isLoading, error, reload } = useMovies({
    mode,
    query: submittedQuery,
    page: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuery(search);
  };

  return (
    <div className="page-container">
      <h1 className="catalog-header">AI Movie Search</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="auth-input" style={{ maxWidth: "400px" }}
        />
        <button type="submit" className="landing-btn-primary" style={{ marginLeft: "1rem" }}>Search</button>
        <button type="button" onClick={reload} className="landing-btn-ghost" style={{ marginLeft: "0.5rem" }}>
          Reload
        </button>
      </form>

      {isLoading && <p>Loading movies… 🎬</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!isLoading && !error && movies.length === 0 && (
        <p>No movies found.</p>
      )}

      <div className="catalog-grid">
        {movies.map((m) => (
          <article key={m.id} className="movie-card">
            {m.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                alt={m.title}
              />
            )}
            <div className="movie-info">
              <h3 className="movie-title">{m.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--accent)" }}>
                ⭐ {m.vote_average?.toFixed?.(1) ?? "N/A"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
