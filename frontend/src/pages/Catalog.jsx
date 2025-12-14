import { useEffect, useState } from "react";
import "../App.css";

export default function Catalog() {
  const [movies, setMovies] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(data => setMovies(data.results));
  }, []);

  return (
    <div className="page-container">
      <h1 className="catalog-header">Trending Movies</h1>
      <div className="catalog-grid">
      {movies.map(m => (
        <div key={m.id} className="movie-card">
          <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
          <div className="movie-info">
            <h3 className="movie-title">{m.title}</h3>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
