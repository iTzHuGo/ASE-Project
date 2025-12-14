import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import "../App.css";

export default function CatalogAI() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [page, setPage] = useState(1);

  // Se submittedQuery estiver vazio, mostramos trending.
  const mode = submittedQuery ? "search" : "trending";

  // Cada página da API tem 20 items. Nós queremos 10.
  // Logo, a página da API é metade da nossa página visual.
  const apiPage = Math.ceil(page / 2);

  const { movies: allMovies, totalPages, isLoading, error, reload } = useMovies({
    mode,
    query: submittedQuery,
    page: apiPage,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuery(search);
    setPage(1); // Reset para a primeira página ao pesquisar
  };

  // Lógica de corte (Slice) para 10 items
  const startIndex = (page - 1) % 2 * 10;
  const displayedMovies = allMovies.slice(startIndex, startIndex + 10);
  
  // Total de páginas visuais = Total API * 2
  const maxPage = totalPages * 2;

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate("/")} 
        className="landing-btn-ghost" 
        style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
      >
        &larr; Home
      </button>
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

      {!isLoading && !error && allMovies.length === 0 && (
        <p>No movies found.</p>
      )}

      <div className="catalog-grid">
        {displayedMovies.map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <article className="movie-card">
              {m.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "2/3", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: "600" }}>
                  No Poster
                </div>
              )}
              <div className="movie-info">
                <h3 className="movie-title">{m.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--accent)" }}>
                  ⭐ {m.vote_average?.toFixed?.(1) ?? "N/A"}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Paginação Bonita */}
      {!isLoading && displayedMovies.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "3rem", paddingBottom: "2rem" }}>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="landing-btn-ghost"
            style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            &larr; Previous
          </button>
          
          <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Page {page}</span>

          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={page >= maxPage}
            className="landing-btn-ghost"
            style={{ opacity: page >= maxPage ? 0.5 : 1, cursor: page >= maxPage ? 'not-allowed' : 'pointer' }}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
