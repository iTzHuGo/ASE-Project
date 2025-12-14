import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css"; 
import { useAuth } from "../hooks/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      
      // Chamada direta à API (Backend na porta 3001)
      const response = await fetch("http://localhost:3001/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Verificar se a resposta é JSON antes de tentar ler (evita o erro <!DOCTYPE...)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor não retornou JSON. Verifique se o backend está a correr e o URL está correto.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha no login. Verifique as credenciais.");
      }

      console.log("Login OK:", data);
      
      // Guardar token e dados do utilizador reais
      if (data.token) localStorage.setItem("token", data.token);
      login(data.user || { email: form.email });
      
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