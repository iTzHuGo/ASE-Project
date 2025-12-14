import { useEffect, useState } from "react";
import "../App.css"; // A linha mágica que liga o estilo
import { Link } from "react-router-dom";

export default function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_TMDB_KEY;
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(data => setTrending(data.results.slice(0, 6))) // Pegamos apenas nos primeiros 6
      .catch(err => console.error("Erro ao carregar trends:", err));
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-inner">
        {/* Orbes Animados */}
        <div className="landing-orb landing-orb--gold" />
        <div className="landing-orb landing-orb--purple" />

        {/* Lado Esquerdo: Texto */}
        <section className="landing-hero">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            POPCORN GALAXY v1.0
          </div>

          <h1 className="landing-title">
            Organiza o teu <span>universo de filmes</span>.
          </h1>

          <p className="landing-subtitle">
            Guarda o que já viste, o que queres ver a seguir e descobre novas
            galáxias de cinema — tudo num só sítio.
          </p>

          <div className="landing-actions">
            <Link to="/login">
              <button className="landing-btn-primary">Entrar</button>
            </Link>
            <Link to="/catalog" className="landing-btn-primary">
              Ver Catálogo
            </Link>
            <Link to="/catalogAI" className="landing-btn-ai">
              Catálogo AI 
            </Link>
            
          </div>

          <div className="landing-meta">
            <div>
              <strong style={{color: '#e5e7eb', display: 'block'}}>Watchlist infinita</strong>
              <span>Nunca perdes um filme.</span>
            </div>
            <div>
              <strong style={{color: '#e5e7eb', display: 'block'}}>Mood picks</strong>
              <span>Sugestões baseadas no vibe.</span>
            </div>
          </div>
        </section>

        {/* Lado Direito: Grid Visual */}
        <aside className="landing-panel">
          <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
             <div style={{fontWeight: '600', color: '#fff'}}>Trending hoje</div>
             <div style={{fontSize: '0.8rem', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: '12px'}}>Live</div>
          </header>

          <div className="landing-mini-grid">
            {trending.map((movie) => (
              <div 
                key={movie.id} 
                className="landing-movie-card" 
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` }}
                title={movie.title}
              />
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}