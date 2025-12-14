# 🍿 Popcorn Galaxy

**Popcorn Galaxy** é uma aplicação web completa para descoberta de filmes, gestão de watchlists e recomendações personalizadas baseadas em Inteligência Artificial.

O projeto combina um frontend moderno em React, um backend robusto em Node.js/Express e um microserviço de recomendação em Python (Flask) que utiliza algoritmos de similaridade (Cosine Similarity) para sugerir filmes com base nas avaliações do utilizador.

## 🚀 Funcionalidades

- **Catálogo de Filmes:** Consulta os filmes em tendência (Trending) via API do TMDB.
- **Pesquisa Inteligente:** Pesquisa filmes por título.
- **Sistema de Autenticação:** Registo e Login seguros com JWT (JSON Web Tokens).
- **Avaliações (Ratings):** Classifica filmes de 1 a 5 estrelas.
- **Watchlist:** Adiciona e remove filmes da tua lista de "Para Ver".
- **Recomendações AI:** Recebe sugestões personalizadas baseadas no teu histórico de avaliações e géneros favoritos.
- **Perfil de Utilizador:** Visualiza o histórico de filmes vistos, a watchlist e recomendações.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **CSS3** (Custom Styling & Animations)
- **React Router DOM**

### Backend & Data
- **Node.js & Express** (API Principal)
- **Python & Flask** (Serviço de Recomendação AI)
- **PostgreSQL** (Base de Dados Relacional)
- **Docker** (Containerização)

### External APIs
- **TMDB API** (The Movie Database)

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e a correr.
- [Node.js](https://nodejs.org/) (v18 ou superior).

### 1. Configuração do Backend (Docker)

O backend (Node.js, Python e PostgreSQL) é orquestrado via Docker.

1. Navegue para a pasta raiz do projeto (onde está o `docker-compose.yml`).
2. Crie um ficheiro `.env` na pasta `backend` com as chaves necessárias (ver secção Variáveis de Ambiente).
3. Execute o comando para levantar os serviços:

```bash
docker compose up -d
```

Isto irá iniciar:
- Base de dados PostgreSQL (porta 5432)
- Backend Node.js (porta 8080)
- Serviço de Recomendação Python (porta 8000)

### 2. Configuração do Frontend

1. Abra um novo terminal e navegue para a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Aceda à aplicação no browser (geralmente em `http://localhost:5173`).

---

## 🔑 Variáveis de Ambiente (.env)

### Backend (`backend/.env`)
```env
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=tua_password
DB_NAME=ase_project
JWT_SECRET=tua_chave_secreta_jwt
TMDB_API_KEY=tua_chave_api_tmdb
EXPRESS_URL=http://backend:8080
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8080
VITE_TMDB_KEY=tua_chave_api_tmdb
```

---

## 👥 Autores

* **Carlos Jordão**
* **Hugo Barro**
* **Miguel Pereira**
* **Nuno Vasques**
* **Olek Sander**