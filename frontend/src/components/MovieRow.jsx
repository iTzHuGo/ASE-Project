
import { useEffect, useState, useRef } from "react";
import MovieCard from "./MovieCard";
import { Button } from "semantic-ui-react";

const API_KEY = "4971be107b4284c757384a30c8a2f9d7";

export default function MovieRow({ title, genreId }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&include_adult=false`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const safe = Array.isArray(data.results) ? data.results : [];
        // ✅ Protege o teu MovieCard (precisa release_date string para .slice)
        const filtered = safe.filter(
          (m) => typeof m.release_date === "string" && m.release_date.length >= 4
        );
        setMovies(filtered);
      })
      .catch((err) => {
        console.error("Erro ao buscar filmes:", err);
        setMovies([]);
      });
  }, [genreId]);

  const scroll = (dir) => {
    if (!rowRef.current) return;
    const amount = 600; // pixels por clique
    rowRef.current.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ marginBottom: 8 }}>{title}</h2>

      {/* Botões Back / Next como na imagem */}
      <div style={{ marginBottom: 8 }}>
        <Button size="small" onClick={() => scroll("back")}>Back</Button>
        <Button size="small" onClick={() => scroll("next")}>Next</Button>
      </div>

      {/* Carrossel horizontal */}
      <div
        ref={rowRef}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          padding: "8px 0",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory", // snap agradável
        }}
      >
        {movies.map((m) => (
          <div
            key={m.id}
            style={{
              minWidth: 220,     // largura fixa para cada card
              maxWidth: 220,
              scrollSnapAlign: "start",
            }}
          >
            {/* Usa o teu MovieCard sem alterações */}
            <MovieCard movie={m} />
          </div>
        ))}
      </div>

      {/* Linha separadora como na imagem */}
      <hr style={{ marginTop: 12, border: 0, borderTop: "1px solid #e0e0e0" }} />
    </div>
  );
}
