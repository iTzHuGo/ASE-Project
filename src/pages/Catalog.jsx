import { useEffect, useState } from "react";

export default function Catalog() {
  const [movies, setMovies] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(data => setMovies(data.results));
  }, []);

  return (
    <div>
      <h1>Trending Movies</h1>
      {movies.map(m => (
        <div key={m.id}>
          <h3>{m.title}</h3>
          <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} />
        </div>
      ))}
    </div>
  );
}
