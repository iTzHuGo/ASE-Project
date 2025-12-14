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
  const [isAI, setIsAI] = useState(false);

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
      
      const endpoint = isAI ? "/api/auth/signup_ai" : "/api/auth/signup";
      const response = await fetch(`${API_URL}${endpoint}`, {
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h2 className="auth-title" style={{ marginBottom: 0 }}>Registar {isAI ? "(AI)" : ""}</h2>
            
            {/* Slider Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ position: "relative", display: "inline-block", width: "46px", height: "22px" }}>
                <input 
                  type="checkbox" 
                  checked={isAI} 
                  onChange={() => setIsAI(!isAI)} 
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{ 
                  position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: isAI ? "#9333ea" : "#4b5563", transition: ".3s", borderRadius: "34px" 
                }}></span>
                <span style={{ 
                  position: "absolute", content: '""', height: "16px", width: "16px", left: "3px", bottom: "3px", 
                  backgroundColor: "white", transition: ".3s", borderRadius: "50%",
                  transform: isAI ? "translateX(24px)" : "translateX(0)"
                }}></span>
              </label>
              <span style={{ color: isAI ? "white" : "#888", fontWeight: isAI ? "bold" : "normal", fontSize: "0.9rem" }}>AI</span>
            </div>
          </div>

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