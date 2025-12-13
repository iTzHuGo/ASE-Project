import { useEffect, useState, useCallback } from "react";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Custom hook para obter filmes do TMDB.
 *
 * @param {Object} options
 * @param {"trending" | "search"} options.mode - modo de fetch
 * @param {string} [options.query] - termo de pesquisa (para mode = "search")
 * @param {number} [options.page] - página de resultados
 */
export function useMovies({
  mode = "trending",
  query = "",
  page = 1,
} = {}) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(() => {
    if (!API_KEY) {
      setError("Missing TMDB API key. Check your .env (VITE_TMDB_KEY).");
      return;
    }

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    let url = "";

    if (mode === "trending") {
      url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`;
    } else if (mode === "search") {
      if (!query?.trim()) {
        // Sem query, não vamos chamar nada — só limpamos resultados
        setMovies([]);
        setIsLoading(false);
        return () => controller.abort();
      }
      const encodedQuery = encodeURIComponent(query.trim());
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodedQuery}&page=${page}`;
    } else {
      setError(`Unsupported mode: ${mode}`);
      setIsLoading(false);
      return () => controller.abort();
    }

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        // TMDB devolve resultados em data.results
        setMovies(Array.isArray(data.results) ? data.results : []);
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // ignorar aborts
        console.error("useMovies error:", err);
        setError(err.message || "Unknown error fetching movies.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    // cleanup: abortar fetch se o componente desmontar ou os deps mudarem
    return () => controller.abort();
  }, [mode, query, page]);

  // correr automaticamente quando deps mudam
  useEffect(() => {
    const cleanup = fetchMovies();
    return cleanup;
  }, [fetchMovies]);

  // função manual para recarregar
  const reload = useCallback(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    isLoading,
    error,
    reload,
  };
}
