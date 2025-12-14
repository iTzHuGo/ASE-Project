import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Catalog() {
  const [movies, setMovies] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(data => setMovies(data.results));
  }, []);

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate("/")} 
        className="landing-btn-ghost" 
        style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
      >
        &larr; Home
      </button>
      <h1 className="catalog-header">Trending Movies</h1>
      <div className="catalog-grid">
      {movies.map(m => (
        <Link key={m.id} to={`/movie/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="movie-card">
            {m.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
            ) : (
              <div style={{ width: "100%", aspectRatio: "2/3", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: "600" }}>
                No Poster
              </div>
            )}
            <div className="movie-info">
              <h3 className="movie-title">{m.title}</h3>
            </div>
          </div>
        </Link>
      ))}
      </div>
    </div>
  );
}
