import { useState } from "react";
import { useMovies } from "../hooks/useMovies";

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
    <div style={{ padding: "1.5rem" }}>
      <h1>Movies</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.5rem", minWidth: "250px", marginRight: "0.5rem" }}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={reload} style={{ marginLeft: "0.5rem" }}>
          Reload
        </button>
      </form>

      {isLoading && <p>Loading movies… 🎬</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!isLoading && !error && movies.length === 0 && (
        <p>No movies found.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        {movies.map((m) => (
          <article
            key={m.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "0.5rem",
              textAlign: "center",
            }}
          >
            {m.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                alt={m.title}
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                }}
              />
            )}
            <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
              {m.title}
            </h3>
            <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
              ⭐ {m.vote_average?.toFixed?.(1) ?? "N/A"}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
