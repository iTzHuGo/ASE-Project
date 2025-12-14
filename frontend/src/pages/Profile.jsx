import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import { useAuth } from "../hooks/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser, logout, login: saveUser } = useAuth();
  const [user, setUser] = useState({ name: "", email: "" });
  const API_URL = import.meta.env.VITE_API_URL;
  const [isEditing, setIsEditing] = useState(false); // Controla o Pop-up
  
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!authUser) {
      navigate("/login"); // Se não houver user, manda para login
    } else {
      setUser({ ...authUser, name: authUser.name || authUser.username || "" });
    }

    // Carregar filmes da API para simular dados
    const API_KEY = import.meta.env.VITE_TMDB_KEY;
    
    // 1. Carregar Histórico Real do Backend
    if (authUser?.id) {
      fetch(`${API_URL}/api/recommendation/user/${authUser.id}?top_n=5`)
        .then(res => {
          if (!res.ok) throw new Error("Erro ao buscar histórico");
          return res.json();
        })
        .then(async (data) => {
          console.log(data);
          // data.ratings contém { tmdb_id, rating }
          // Precisamos de buscar os detalhes de cada filme ao TMDB para mostrar o poster/título
          const promises = data.ratings.map(async (item) => {
            const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${item.tmdb_id}?api_key=${API_KEY}`);
            const tmdbData = await tmdbRes.json();
            return { ...tmdbData, myRating: item.rating };
          });
          
          const movies = await Promise.all(promises);
          setWatchedMovies(movies);

          // 2. Processar Recomendados (recommended_movies_ids)
          if (data.recommended_movies_ids && Array.isArray(data.recommended_movies_ids)) {
            const recPromises = data.recommended_movies_ids.map(async (id) => {
              const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
              return tmdbRes.json();
            });
            const recMovies = await Promise.all(recPromises);
            setRecommendedMovies(recMovies);
          }
        })
        .catch(err => console.error("Erro ao carregar filmes vistos:", err));
    }

    // 3. Carregar Watchlist
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/user/watchlist`, {
        headers: { "x-access-token": token }
      })
      .then(res => {
        if (res.ok) return res.json();
        return [];
      })
      .then(data => setWatchlist(data))
      .catch(err => console.error("Erro ao carregar watchlist:", err));
    }

  }, [navigate, authUser]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveUser(user);
    setIsEditing(false); // Fecha o modal
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/user/watchlist/${movieId}`, {
        method: "DELETE",
        headers: { "x-access-token": token }
      });

      if (response.ok) {
        setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
        setToastMessage("Filme removido da Watchlist!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao remover da watchlist:", error);
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Utilizador";

  return (
    <div className="page-container">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <span style={{ fontSize: "1.2rem" }}>✨</span>
          {toastMessage}
        </div>
      )}

      {/* CABEÇALHO DO PERFIL */}
      <header className="profile-header">
        <div className="profile-welcome">
          <h1>Olá, {firstName}! 👋</h1>
          <p>Membro desde o inicio, Obrigado pela confiança! • {watchedMovies.length} filmes vistos </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setIsEditing(true)} className="landing-btn-ghost">
            Editar Perfil
          </button>
          <button onClick={handleLogout} className="landing-btn-ghost" style={{ borderColor: "#ef4444", color: "#ef4444" }}>
            Sair
          </button>
        </div>
      </header>

      {/* SECÇÃO: RECOMENDADOS */}
      <section>
        <h2 className="section-title">Recomendados para ti</h2>
        <div className="catalog-grid">
          {recommendedMovies.map(m => (
            <Link key={m.id} to={`/movie/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="movie-card">
                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECÇÃO: WATCHLIST */}
      <section>
        <h2 className="section-title">Minha Watchlist</h2>
        <div className="catalog-grid">
          {watchlist.length > 0 ? watchlist.map(m => (
            <Link key={m.id} to={`/movie/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="movie-card" style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFromWatchlist(m.id);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  fontSize: "14px",
                  transition: "all 0.2s"
                }}
                title="Remover da Watchlist"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ef4444";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.7)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
              >
                ✕
              </button>
              <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
              <div className="movie-info">
                <h3 className="movie-title">{m.title}</h3>
              </div>
            </div>
            </Link>
          )) : <p style={{ color: "var(--text-muted)" }}>Ainda não adicionaste filmes à watchlist.</p>}
        </div>
      </section>

      {/* SECÇÃO: HISTÓRICO (COM RATINGS) */}
      <section>
        <h2 className="section-title">Vistos Recentemente</h2>
        <div className="catalog-grid">
          {watchedMovies.map(m => (
            <Link key={m.id} to={`/movie/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="movie-card">
                <div className="user-rating-badge">Teu: {m.myRating}</div>
                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                </div>
              </div>
            </Link>
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