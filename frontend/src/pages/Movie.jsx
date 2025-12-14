// src/pages/Movie.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../App.css";

const API_KEY = "4971be107b4284c757384a30c8a2f9d7";

export default function Movie() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&include_adult=false`)
      .then((r) => r.json())
      .then((data) => setMovie(data));
    
    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&include_adult=false`)
      .then((r) => r.json())
      .then((data) => setSimilar(Array.isArray(data.results) ? data.results : []));
  }, [id]);

  const handleRate = async (value) => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    // Se não estiver logado, avisa e redireciona
    if (!userStr || !token) {
      alert("Por favor, faz login para avaliares este filme.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);

    // Extrair apenas os IDs dos géneros para enviar para o backend
    const genreIds = movie.genres ? movie.genres.map(g => g.id) : [];

    try {
      const response = await fetch(`${API_URL}/api/user/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        },
        body: JSON.stringify({ 
          movieId: movie.id, 
          rating: value,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          overview: movie.overview,
          genre_ids: genreIds
        })
      });

      if (response.ok) {
        setRating(value);
        alert("Obrigado pela tua avaliação!");
      }
    } catch (error) {
      console.error("Erro ao enviar rating:", error);
    }
  };

  if (!movie) return null;

return (
    <div className="page-container">
      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate(-1)} 
        className="landing-btn-ghost" 
        style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
      >
        &larr; Back
      </button>

      {/* Detalhes do Filme (Estilo Card/Panel) */}
      <div className="auth-card" style={{ display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* Poster */}
        <div style={{ flex: "0 0 300px", width: "100%", maxWidth: "300px" }}>
          {movie.poster_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              style={{ width: "100%", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
            />
          ) : (
            <div style={{ width: "100%", height: "450px", background: "#333", borderRadius: "16px" }} />
          )}
        </div>

        {/* Informação */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "800", lineHeight: "1.1", marginBottom: "1rem" }}>{movie.title}</h1>
          
          <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            <span>{movie.release_date?.split("-")[0]}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
            <span>•</span>
            <span>{movie.genres?.map(g => g.name).join(", ")}</span>
          </div>

          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "var(--accent)" }}>Synopsis</h3>
          <p style={{ lineHeight: "1.6", color: "#e2e8f0", marginBottom: "2rem" }}>
            {movie.overview || "No synopsis available."}
          </p>

          {/* Rating Box */}
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Your Rating</span>
              <span style={{ color: "var(--accent)", fontWeight: "bold" }}>Global: ⭐ {movie.vote_average?.toFixed(1)}</span>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    cursor: "pointer",
                    fontSize: "2.5rem",
                    color: star <= (hover || rating) ? "var(--accent)" : "rgba(255,255,255,0.2)",
                    transition: "transform 0.2s, color 0.2s",
                    transform: star <= hover ? "scale(1.2)" : "scale(1)"
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      <div style={{ marginTop: "4rem" }}>
        <h2 className="section-title">You Might Enjoy</h2>
        <div className="catalog-grid">
        {similar.map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
              <div className="movie-info">
                <h3 className="movie-title">{m.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--accent)" }}>
                  ⭐ {m.vote_average?.toFixed?.(1) ?? "N/A"}
                </p>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}