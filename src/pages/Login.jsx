import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // se não usares mais nada aqui, até podes remover
import { login as loginRequest } from "../services/authAPi";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // 👉 Ligação ao backend (para já, ao placeholder em authApi.js)
      const data = await loginRequest(form);

      console.log("Login OK:", data);
      // TODO: guardar token / user (ex: localStorage.setItem("token", data.token))

      navigate("/catalog");
    } catch (err) {
      setError(err.message || "Erro inesperado no login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-inner">
        {/* Orbes de glow de fundo */}
        <div className="auth-orb auth-orb--amber" />
        <div className="auth-orb auth-orb--indigo" />

        {/* Lado esquerdo – texto / hero */}
        <section className="auth-hero">
          <div className="auth-kicker">POPCORN GALAXY</div>
          <h1 className="auth-hero-title">
            Bem-vindo de volta à <span>tua sala de cinema</span>.
          </h1>
          <p className="auth-hero-subtitle">
            Faz login para veres a tua watchlist, os filmes que já viste e os que
            estão à espera da próxima sessão.
          </p>
        </section>

        {/* Lado direito – card com o formulário */}
        <div className="auth-card">
          <div className="auth-tag">Login</div>
          <h2 className="auth-title">Entra na tua conta</h2>
          <p className="auth-subtitle">
            Usa o email e password que escolheste no registo.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="auth-input"
                placeholder="demo@movies.app"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="auth-input"
                placeholder="123456"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <div className="auth-footer">
            Ainda não tens conta? <a href="/register">Regista-te</a>
          </div>
        </div>
      </div>
    </div>
  );
}
