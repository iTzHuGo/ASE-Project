import "./../app.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="landing-page">
      <div className="landing-inner">
        <div className="landing-orb landing-orb--gold" />
        <div className="landing-orb landing-orb--purple" />

        <section className="landing-hero">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            POPCORN GALAXY
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

            <Link to="/register">
              <button className="landing-btn-ghost">
                Criar conta
              </button>
            </Link>
          </div>

          <div className="landing-meta">
            <div className="landing-meta-item">
              <strong>Watchlist infinita</strong>
              Nunca mais perdes aquele filme que alguém recomendou.
            </div>
            <div className="landing-meta-item">
              <strong>Mood-based picks</strong>
              Liga o cérebro ou só come pipocas — tu decides.
            </div>
          </div>
        </section>

        <aside className="landing-panel">
          <header className="landing-panel-header">
            <div>
              <div className="landing-panel-title">Trending hoje</div>
              <div className="landing-panel-chip">🎬 Popcorn Galaxy Mix</div>
            </div>
          </header>

          <div className="landing-mini-grid">
            {/* Aqui podes depois mapear filmes reais; por enquanto é estático */}
            <div className="landing-movie-card">
              <div
                className="landing-movie-poster"
                style={{ backgroundImage: "url(https://images.pexels.com/photos/799152/pexels-photo-799152.jpeg?auto=compress&cs=tinysrgb&w=400)" }}
              />
              <div className="landing-movie-body">
                <div className="landing-movie-title">Neon Nights</div>
                <div className="landing-movie-meta">Sci-Fi • 2024</div>
              </div>
            </div>
            <div className="landing-movie-card">
              <div
                className="landing-movie-poster"
                style={{ backgroundImage: "url(https://images.pexels.com/photos/799127/pexels-photo-799127.jpeg?auto=compress&cs=tinysrgb&w=400)" }}
              />
              <div className="landing-movie-body">
                <div className="landing-movie-title">Midnight Screen</div>
                <div className="landing-movie-meta">Drama • 2022</div>
              </div>
            </div>
            <div className="landing-movie-card">
              <div
                className="landing-movie-poster"
                style={{ backgroundImage: "url(https://images.pexels.com/photos/799114/pexels-photo-799114.jpeg?auto=compress&cs=tinysrgb&w=400)" }}
              />
              <div className="landing-movie-body">
                <div className="landing-movie-title">Popcorn Dreams</div>
                <div className="landing-movie-meta">Comedy • 2023</div>
              </div>
            </div>
          </div>
        </aside>

        <footer className="landing-footer">
          Popcorn Galaxy · O teu cantinho privado para organizar maratonas,
          guilty pleasures e clássicos esquecidos.
        </footer>
      </div>
    </div>
  );
}
