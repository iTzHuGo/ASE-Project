
// components/Catalog.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../MovieCard";
import "semantic-ui-css/semantic.min.css";

const API_KEY = "4971be107b4284c757384a30c8a2f9d7";

export default function Catalog() {
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState(null);

  const [genreMovies, setGenreMovies] = useState([]);
  const [genreLoading, setGenreLoading] = useState(false);
  const [genreError, setGenreError] = useState(null);

  // Ordenação separada: data e rating
  const [sortRelease, setSortRelease] = useState(""); // "", "release_desc", "release_asc"
  const [sortRating, setSortRating] = useState("");  // "", "rating_desc", "rating_asc"

  const selectedGenreName = useMemo(() => {
    if (!selectedGenreId) return null;
    const g = genres.find((x) => x.id === selectedGenreId);
    return g?.name || null;
  }, [selectedGenreId, genres]);

  const pageTitle = selectedGenreName ? `${selectedGenreName} Movies` : "Trending Movies";

  // Trending
  useEffect(() => {
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&include_adult=false`;
    setTrendingLoading(true);
    setTrendingError(null);

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`TMDB ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const safe = Array.isArray(data.results) ? data.results : [];
        const filtered = safe.filter(
          (m) => typeof m.release_date === "string" && m.release_date.length >= 4
        );
        setTrending(filtered);
      })
      .catch(() => {
        setTrending([]);
        setTrendingError("Não foi possível carregar Trending.");
      })
      .finally(() => setTrendingLoading(false));
  }, []);

  // Lista de géneros
  useEffect(() => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const safe = Array.isArray(data.genres) ? data.genres : [];
        setGenres(safe);
      })
      .catch(() => {
        setGenres([]);
      });
  }, []);

  // Filmes por género
  useEffect(() => {
    if (!selectedGenreId) {
      setGenreMovies([]);
      setGenreLoading(false);
      setGenreError(null);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenreId}&include_adult=false&sort_by=popularity.desc`;

    setGenreLoading(true);
    setGenreError(null);

    fetch(url, { signal })
      .then((r) => {
        if (!r.ok) throw new Error(`TMDB ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const safe = Array.isArray(data.results) ? data.results : [];
        const filtered = safe.filter(
          (m) => typeof m.release_date === "string" && m.release_date.length >= 4
        );
        setGenreMovies(filtered);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setGenreMovies([]);
          setGenreError("Não foi possível carregar filmes deste género.");
        }
      })
      .finally(() => setGenreLoading(false));

    return () => controller.abort();
  }, [selectedGenreId]);

  // Base da lista
  const baseList = selectedGenreId === null ? trending : genreMovies;

  // Ordenação (aplica apenas um critério de cada vez)
  const sortedList = useMemo(() => {
    const arr = [...baseList];

    const release = (m) =>
      typeof m.release_date === "string" ? m.release_date : "";
    const rating = (m) =>
      typeof m.vote_average === "number" ? m.vote_average : 0;

    if (sortRelease) {
      if (sortRelease === "release_desc") {
        arr.sort((a, b) =>
          release(b) > release(a) ? 1 : release(b) < release(a) ? -1 : 0
        );
      } else if (sortRelease === "release_asc") {
        arr.sort((a, b) =>
          release(a) > release(b) ? 1 : release(a) < release(b) ? -1 : 0
        );
      }
      return arr;
    }

    if (sortRating) {
      if (sortRating === "rating_desc") {
        arr.sort((a, b) => rating(b) - rating(a));
      } else if (sortRating === "rating_asc") {
        arr.sort((a, b) => rating(a) - rating(b));
      }
      return arr;
    }

    return arr;
  }, [baseList, sortRelease, sortRating]);

  const handleReleaseChange = (value) => {
    setSortRelease(value || "");
    if (value) setSortRating("");
  };
  const handleRatingChange = (value) => {
    setSortRating(value || "");
    if (value) setSortRelease("");
  };

  const clearRelease = () => setSortRelease("");
  const clearRating = () => setSortRating("");
  const clearAll = () => {
    setSortRelease("");
    setSortRating("");
  };

  return (
    <div style={{ maxWidth: 2400, margin: "0 auto", padding: "0 32px" }}>
      <h2 className="ui header" style={{ margin: "16px 0" }}>{pageTitle}</h2>

      {/* Filtro de géneros */}
      <div className="ui segment">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            className={`ui small toggle button ${selectedGenreId === null ? "active" : ""}`}
            onClick={() => setSelectedGenreId(null)}
          >
            Trending
          </button>

          {genres.map((g) => (
            <button
              key={g.id}
              className={`ui small toggle button ${selectedGenreId === g.id ? "active" : ""}`}
              onClick={() => setSelectedGenreId(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dois dropdowns de ordenação (Data e Rating) */}
      <div className="ui segment" style={{ border: "none" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          {/* Dropdown de Data */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label htmlFor="sortRelease"><strong>Data:</strong></label>
            <select
              id="sortRelease"
              className="ui dropdown"
              value={sortRelease}
              onChange={(e) => handleReleaseChange(e.target.value)}
              style={{ minWidth: 220 }}
              aria-label="Ordenar por data de lançamento"
            >
              <option value="">(Sem ordenação por data)</option>
              <option value="release_desc">Data ↓ (Recente primeiro)</option>
              <option value="release_asc">Data ↑ (Antigo primeiro)</option>
            </select>
            <button
              className="ui small basic button"
              onClick={clearRelease}
              title="Limpar ordenação por data"
            >
              Clear
            </button>
          </div>

          <div className="ui divider" style={{ margin: 0 }} />

          {/* Dropdown de Rating */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label htmlFor="sortRating"><strong>Rating:</strong></label>
            <select
              id="sortRating"
              className="ui dropdown"
              value={sortRating}
              onChange={(e) => handleRatingChange(e.target.value)}
              style={{ minWidth: 220 }}
              aria-label="Ordenar por rating"
            >
              <option value="">(Sem ordenação por rating)</option>
              <option value="rating_desc">Rating ↑ (Maior primeiro)</option>
              <option value="rating_asc">Rating ↓ (Menor primeiro)</option>
            </select>
            <button
              className="ui small basic button"
              onClick={clearRating}
              title="Limpar ordenação por rating"
            >
              Clear
            </button>
          </div>

          {/* Clear geral */}
          <button
            className="ui small basic button"
            onClick={clearAll}
            title="Limpar todas as ordenações"
            style={{ marginLeft: 8 }}
          >
            Clear tudo
          </button>
        </div>
      </div>

      {selectedGenreId === null ? (
        <>
          {trendingError && (
            <div className="ui negative message">
              <div className="header">Erro ao carregar Trending</div>
              <p>{trendingError}</p>
            </div>
          )}

          {trendingLoading && (
            <div className="ui active inline loader" style={{ margin: "12px 0" }} />
          )}

          <div className="ui five stackable doubling cards">
            {sortedList.map((m) => (
              <Link
                key={m.id}
                to={`/movie/${m.id}`}
                className="card"
                style={{ border: "none", boxShadow: "none" }}
              >
                <MovieCard movie={m} />
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="ui divider" />

          {genreError && (
            <div className="ui negative message">
              <div className="header">Erro ao carregar {selectedGenreName} Movies</div>
              <p>{genreError}</p>
            </div>
          )}

          {genreLoading && (
            <div className="ui active inline loader" style={{ margin: "12px 0" }} />
          )}

          {!genreLoading && !genreError && sortedList.length === 0 && (
            <div style={{ color: "#777", marginBottom: 12 }}>
              Sem resultados para este género neste momento.
            </div>
          )}

          <div className="ui five stackable doubling cards">
            {sortedList.map((m) => (
              <Link
                key={m.id}
                to={`/movie/${m.id}`}
                className="card"
                style={{ border: "none", boxShadow: "none" }}
              >
                <MovieCard movie={m} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
