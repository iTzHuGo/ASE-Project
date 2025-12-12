import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css"; 
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
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await loginRequest(form);
      console.log("Login OK:", data);
      
      // Guardar dados do utilizador (Simulação)
      localStorage.setItem("user", JSON.stringify({ name: "Utilizador", email: form.email }));
      
      navigate("/catalog");
    } catch (err) {
      setError(err.message || "Erro inesperado no login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Orbes de fundo */}
      <div className="auth-orb orb-gold" />
      <div className="auth-orb orb-purple" />

      <div className="auth-inner">
        {/* Texto à Esquerda */}
        <div className="auth-hero">
          <div className="auth-kicker">POPCORN GALAXY</div>
          <h1 className="auth-hero-title">Bem-vindo de volta.</h1>
          <p className="auth-hero-subtitle">
            A tua watchlist e as melhores recomendações de filmes estão à tua espera.
          </p>
        </div>

        {/* Formulário à Direita */}
        <div className="auth-card">
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">Insere os teus dados para continuar.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="auth-input"
                placeholder="exemplo@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
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
            Ainda não tens conta? <Link to="/register">Regista-te aqui</Link>
          </div>
        </div>
      </div>
    </div>
  );
}