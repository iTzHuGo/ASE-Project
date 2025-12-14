
// src/pages/Catalog.jsx
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { Card, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const API_KEY = "4971be107b4284c757384a30c8a2f9d7";
  const pageTitle = "Trending Movies";

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&include_adult=false`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`TMDB respondeu ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const safe = Array.isArray(data.results) ? data.results : [];
        const filtered = safe.filter(
          (m) => typeof m.release_date === "string" && m.release_date.length >= 4
        );
        setMovies(filtered);
        setError(null);
      })
      .catch((err) => {
        console.error("[Trending] erro:", err);
        setMovies([]);
        setError("Não foi possível carregar Trending. Verifica a API key ou a ligação.");
      });
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <h2 className="ui header" style={{ margin: "16px 0" }}>{pageTitle}</h2>

      <Card.Group
        itemsPerRow={5}     
        stackable            
        doubling             
        >
        {movies.map((m) => (
          <Link key ={m.id} to={`/movie/${m.id}`} style={{ textDecoration: "none"}} >
          <MovieCard movie={m} />
          </Link>
        ))}
      </Card.Group>
    </div>
  );
}
