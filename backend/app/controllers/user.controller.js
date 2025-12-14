import db from "../config/db.config.js";

// ==========================================
// FEATURE: RATE MOVIE
// DESCRIPTION: Controller to handle user movie ratings.
//              Inserts a rating linked to a user and a movie into the database.
// ==========================================
export const rateMovie = async (req, res) => {
    // O middleware [authJwt.verifyToken] popula o req.userId com o ID do utilizador autenticado
    const userId = req.userId;
    const { movieId, rating, title, poster_path, release_date, overview, genre_ids } = req.body;

    if (!movieId || !rating) {
        return res.status(400).json({ message: "Movie ID and Rating are required." });
    }

    try {
        // 1. Garantir que o filme existe na tabela 'movies' (Cache) e obter o ID interno
        const movieQuery = `
            INSERT INTO movies (tmdb_id, title, poster_path, release_date, synopsis, genre_ids)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (tmdb_id) 
            DO UPDATE SET 
                title = EXCLUDED.title,
                genre_ids = EXCLUDED.genre_ids
            RETURNING id;
        `;
        
        // Tratar data vazia caso a API não envie
        const validDate = release_date || null;
        const movieResult = await db.query(movieQuery, [movieId, title || "Untitled", poster_path, validDate, overview, genre_ids || []]);
        const internalMovieId = movieResult.rows[0].id;

        // 2. Inserir o rating usando o ID interno correto
        const ratingQuery = `
            INSERT INTO ratings (user_id, movie_id, rating_value)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, movie_id)
            DO UPDATE SET rating_value = EXCLUDED.rating_value
            RETURNING *;
        `;
        
        const values = [userId, internalMovieId, rating];
        const result = await db.query(ratingQuery, values);


        res.status(201).json({ message: "Rating submitted successfully!", data: result.rows[0] });
    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).json({ message: "Error submitting rating.", error: error.message });
    }
};