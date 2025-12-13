import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false); // Controla o Pop-up
  
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login"); // Se não houver user, manda para login
    } else {
      setUser(JSON.parse(stored));
    }

    // Carregar filmes da API para simular dados
    const API_KEY = import.meta.env.VITE_TMDB_KEY;
    
    // 1. Simular "Histórico" (Usamos Top Rated)
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1`)
      .then(r => r.json())
      .then(data => {
        // Adicionar ratings falsos do utilizador
        const mocked = data.results.slice(0, 4).map(m => ({
          ...m,
          myRating: (Math.random() * 2 + 8).toFixed(1) // Rating entre 8.0 e 10.0
        }));
        setWatchedMovies(mocked);
      });

    // 2. Simular "Recomendados" (Usamos Popular)
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=2`)
      .then(r => r.json())
      .then(data => setRecommendedMovies(data.results.slice(0, 4)));

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false); // Fecha o modal
  };

  const names = user?.name ? user.name.split(" ") : ["Utilizador"];

  return (
    <div className="page-container">
      
      {/* CABEÇALHO DO PERFIL */}
      <header className="profile-header">
        <div className="profile-welcome">
          <h1>Olá, {names}! 👋</h1>
          <p>Membro desde 2024 • {watchedMovies.length} filmes vistos este mês</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="landing-btn-ghost">
          Editar Perfil
        </button>
      </header>

      {/* SECÇÃO: RECOMENDADOS */}
      <section>
        <h2 className="section-title">Recomendados para ti</h2>
        <div className="catalog-grid">
          {recommendedMovies.map(m => (
            <div key={m.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
              <div className="movie-info">
                <h3 className="movie-title">{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECÇÃO: HISTÓRICO (COM RATINGS) */}
      <section>
        <h2 className="section-title">Vistos Recentemente</h2>
        <div className="catalog-grid">
          {watchedMovies.map(m => (
            <div key={m.id} className="movie-card">
              <div className="user-rating-badge">Teu: {m.myRating}</div>
              <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
              <div className="movie-info">
                <h3 className="movie-title">{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL DE EDIÇÃO (POP-UP) */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="auth-title">Editar Conta</h2>
            <p className="auth-subtitle">Atualiza os teus dados pessoais.</p>
            
            <form className="auth-form" onSubmit={handleSave}>
              <div className="auth-field">
                <label className="auth-label">Nome</label>
                <input className="auth-input" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input className="auth-input" value={user.email} disabled style={{ opacity: 0.7 }} />
              </div>
              
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsEditing(false)} className="landing-btn-ghost" style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" className="auth-btn" style={{ flex: 1, marginTop: 0 }}>
                  Guardar
                </button>
              </div>

              <button type="button" onClick={handleLogout} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", marginTop: "1rem", fontSize: "0.9rem" }}>
                Terminar Sessão
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}