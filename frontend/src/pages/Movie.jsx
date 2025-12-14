
// src/pages/Movie.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
// import "semantic-ui-css/semantic.min.css";

const API_KEY = "4971be107b4284c757384a30c8a2f9d7";

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&include_adult=false`)
      .then((r) => r.json())
      .then((data) => setMovie(data));
    
    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&include_adult=false`)
      .then((r) => r.json())
      .then((data) => setSimilar(Array.isArray(data.results) ? data.results : []));
  }, [id]);


  if (!movie) return null;


 
return (
  <div style={{ padding: 20 }}>
    
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <div style={{ flex: "0 0 320px", maxWidth: 420 }}>
        <MovieCard movie={movie} />
      </div>

      <div style={{ flex: 1 }}>
        <h2>Synopsis</h2>
        <p>{movie.overview || "No Synopsy Available"}</p>
        <h3>Details</h3>
        <p><strong>Duration:</strong> {movie.runtime ? `${movie.runtime} min` : "—"}</p>
        <p><strong>Score:</strong> ⭐ {movie.vote_average?.toFixed(1) || "—"} / 10</p>
        <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(" • ") || "—"}</p>
      </div>
    </div> 


    <div style={{ marginTop: 40 }}>
      <h2>You Might Enjoy</h2>
      <div
        className="ui cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {similar.map((m) => (
          <Link
            key={m.id}
            to={`/movie/${m.id}`}
            style={{ textDecoration: "none" }}
          >
            <MovieCard movie={m} />
          </Link>
        ))}
      </div>
       </div>
  </div>
);
}