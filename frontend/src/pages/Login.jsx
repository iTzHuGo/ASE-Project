import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css"; 
import { useAuth } from "../hooks/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      
      const endpoint = isAI ? "/api/auth/signin_ai" : "/api/auth/signin";
      const response = await fetch(`${API_URL}${endpoint}`, {
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
      
      setShowToast(true);
      setTimeout(() => {
        navigate("/catalog");
      }, 1500);
    } catch (err) {
      setError(err.message || "Erro inesperado no login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <span style={{ fontSize: "1.2rem" }}>✨</span>
          Login efetuado com sucesso! A entrar...
        </div>
      )}

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h2 className="auth-title" style={{ marginBottom: 0 }}>Login {isAI ? "(AI)" : ""}</h2>
            
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