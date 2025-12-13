// src/services/authApi.js

// ⛔️ Placeholder: neste momento isto NÃO fala com um backend real.
// Quando tiveres o Express pronto, só precisas de trocar o conteúdo
// destas funções por fetch("/api/...").

function fakeDelay(ms = 600) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function login({ email, password }) {
  await fakeDelay();

  // Exemplo de validação "a fingir"
  if (email === "demo@movies.app" && password === "123456") {
    return {
      success: true,
      token: "FAKE_JWT_TOKEN",
      user: { name: "Demo User", email },
    };
  }

  const err = new Error("Credenciais inválidas (placeholder).");
  err.status = 401;
  throw err;
}

export async function register({ name, email, password }) {
  await fakeDelay();

  // Aqui também é tudo “a fingir”
  // Podes adicionar regras tipo: se o email já existir, mandar erro, etc.
  if (!email.endsWith("@example.com")) {
    return {
      success: true,
      token: "FAKE_JWT_TOKEN_REGISTER",
      user: { name, email },
    };
  }

  const err = new Error("Este email já está registado (placeholder).");
  err.status = 409;
  throw err;
}

/*
  🔁 QUANDO TIVERES EXPRESS PRONTO:
  Substituis o conteúdo das funções por algo deste género:

  export async function login(credentials) {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include", // se usares cookies/sessões
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.message || "Falha no login.");
    }

    return res.json();
  }
*/
