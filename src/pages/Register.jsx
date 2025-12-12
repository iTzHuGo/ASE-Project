import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // idem, opcional se já tens tudo em app.css
import { register as registerRequest } from "../services/authAPi";

export default function Register() {
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
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    try {
      setLoading(true);

      // 👉 Ligação ao backend (para já, ao placeholder em authApi.js)
      const data = await registerRequest({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log("Registo OK:", data);
      // TODO: guardar token / user se quiseres login automático

      // Por agora, depois de registar vai para login
      navigate("/login");
    } catch (err) {
      setError(err.message || "Erro inesperado no registo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-inner">
        {/* Orbes */}
        <div className="auth-orb auth-orb--amber" />
        <div className="auth-orb auth-orb--indigo" />

        {/* Lado esquerdo – texto / hero */}
        <section className="auth-hero">
          <div className="auth-kicker">POPCORN GALAXY</div>
          <h1 className="auth-hero-title">
            Cria a tua <span>constelação de filmes</span>.
          </h1>
          <p className="auth-hero-subtitle">
            Regista-te para começares a guardar tudo o que já viste,
            o que tens na lista e o que não queres mesmo perder.
          </p>
        </section>

        {/* Lado direito – card com o formulário */}
        <div className="auth-card">
          <div className="auth-tag">Registo</div>
          <h2 className="auth-title">Cria a tua conta</h2>
          <p className="auth-subtitle">
            Vai ser rápido: só precisamos do teu nome, email e uma password.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">
                Nome
              </label>
              <input
                id="name"
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
              <label className="auth-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
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
              <label className="auth-label" htmlFor="password">
                Password
              </label>
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

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirmPassword">
                Confirmar password
              </label>
              <input
                id="confirmPassword"
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
              {loading ? "A registar..." : "Criar conta"}
            </button>
          </form>

          <div className="auth-footer">
            Já tens conta? <a href="/login">Faz login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
