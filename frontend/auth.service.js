const API_URL = '/api/auth/';

// Registar utilizador
const register = async (username, email, password) => {
  const response = await fetch(API_URL + 'register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao registar');
  }
  return data;
};

// Fazer Login
const login = async (email, password) => {
  const response = await fetch(API_URL + 'login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao fazer login');
  }

  // Se recebermos um token, guardamos no localStorage
  if (data.token || data.accessToken) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

// Fazer Logout
const logout = () => {
  localStorage.removeItem('user');
};

// Obter utilizador atual
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};