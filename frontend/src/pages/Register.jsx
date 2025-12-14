import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css"; 

export default function Register() {
	const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.password !== form.confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      // Verificar se a resposta é JSON antes de tentar ler
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Resposta da API (não-JSON):", text);
        throw new Error(`Erro na API (Status: ${response.status}). Verifique a consola.`);
      }

      const data = await response.json();

      if (!response.ok) {
        // Se o backend enviar um erro detalhado (data.error), mostramos isso também
        const errorMessage = data.error ? `${data.message} (${data.error})` : (data.message || "Erro ao criar conta.");
        throw new Error(errorMessage);
      }

      console.log("Registo OK:", data);
      navigate("/login");
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(err.message || "Erro no registo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-orb orb-gold" />
      <div className="auth-orb orb-purple" />

      <div className="auth-inner">
        <div className="auth-hero">
          <div className="auth-kicker">JUNTA-TE À GALÁXIA</div>
          <h1 className="auth-hero-title">Cria a tua conta.</h1>
          <p className="auth-hero-subtitle">
            Começa a organizar os teus filmes favoritos e descobre novas pérolas do cinema.
          </p>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">Registar</h2>
          <p className="auth-subtitle">É rápido e gratuito.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Nome</label>
              <input
                name="name"
                type="text"
                className="auth-input"
                placeholder="O teu nome"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                name="email"
                type="email"
                className="auth-input"
                placeholder="teu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                name="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirmar Password</label>
              <input
                name="confirmPassword"
                type="password"
                className="auth-input"
                placeholder="Repete a password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "A criar conta..." : "Criar Conta"}
            </button>
          </form>

          <div className="auth-footer">
            Já tens conta? <Link to="/login">Entrar</Link>
          </div>
        </div>
      </div>
    </div>
  );
}