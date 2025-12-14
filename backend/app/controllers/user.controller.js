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

// ==========================================
// FEATURE: ADD TO WATCHLIST
// DESCRIPTION: Adds a movie to the user's 'Watchlist'.
//              Creates the list if it doesn't exist.
// ==========================================
export const addToWatchlist = async (req, res) => {
    const userId = req.userId;
    const { movieId, title, poster_path, release_date, overview, genre_ids } = req.body;

    if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required." });
    }

    try {
        // 1. Garantir que o filme existe na tabela 'movies'
        const movieQuery = `
            INSERT INTO movies (tmdb_id, title, poster_path, release_date, synopsis, genre_ids)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (tmdb_id) 
            DO UPDATE SET 
                title = EXCLUDED.title,
                genre_ids = EXCLUDED.genre_ids
            RETURNING id;
        `;
        
        const validDate = release_date || null;
        const movieResult = await db.query(movieQuery, [movieId, title || "Untitled", poster_path, validDate, overview, genre_ids || []]);
        const internalMovieId = movieResult.rows[0].id;

        // 2. Verificar se a lista 'Watchlist' existe para o user, se não, criar
        let listQuery = `SELECT id FROM lists WHERE user_id = $1 AND name = 'Watchlist'`;
        let listResult = await db.query(listQuery, [userId]);
        
        let listId;
        if (listResult.rows.length === 0) {
            const createListQuery = `INSERT INTO lists (user_id, name) VALUES ($1, 'Watchlist') RETURNING id`;
            const createListResult = await db.query(createListQuery, [userId]);
            listId = createListResult.rows[0].id;
        } else {
            listId = listResult.rows[0].id;
        }

        // 3. Adicionar filme à lista
        const addQuery = `
            INSERT INTO list_movie (list_id, movie_id)
            VALUES ($1, $2)
            ON CONFLICT (list_id, movie_id) DO NOTHING;
        `;
        
        await db.query(addQuery, [listId, internalMovieId]);

        res.status(201).json({ message: "Movie added to Watchlist successfully!" });
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        res.status(500).json({ message: "Error adding to watchlist.", error: error.message });
    }
};

// ==========================================
// FEATURE: GET WATCHLIST
// DESCRIPTION: Retrieves all movies from the user's 'Watchlist'.
// ==========================================
export const getWatchlist = async (req, res) => {
    const userId = req.userId;

    try {
        const query = `
            SELECT m.tmdb_id AS id, m.title, m.poster_path, m.release_date, m.synopsis, m.genre_ids
            FROM movies m
            JOIN list_movie lm ON m.id = lm.movie_id
            JOIN lists l ON l.id = lm.list_id
            WHERE l.user_id = $1 AND l.name = 'Watchlist'
        `;
        
        const result = await db.query(query, [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        res.status(500).json({ message: "Error fetching watchlist.", error: error.message });
    }
};

// ==========================================
// FEATURE: REMOVE FROM WATCHLIST
// DESCRIPTION: Removes a movie from the user's 'Watchlist'.
// ==========================================
export const removeFromWatchlist = async (req, res) => {
    const userId = req.userId;
    const movieId = req.params.movieId; // TMDB ID passado no URL

    if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required." });
    }

    try {
        const query = `
            DELETE FROM list_movie
            WHERE list_id = (SELECT id FROM lists WHERE user_id = $1 AND name = 'Watchlist')
            AND movie_id = (SELECT id FROM movies WHERE tmdb_id = $2)
        `;
        
        const result = await db.query(query, [userId, movieId]);

        res.status(200).json({ message: "Movie removed from Watchlist successfully!", deletedCount: result.rowCount });
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        res.status(500).json({ message: "Error removing from watchlist.", error: error.message });
    }
};

// ==========================================
// FEATURE: GET USER RATING
// DESCRIPTION: Retrieves the rating a user gave to a specific movie.
// ==========================================
export const getUserRating = async (req, res) => {
    const userId = req.userId;
    const movieId = req.params.movieId; // TMDB ID

    if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required." });
    }

    try {
        const query = `
            SELECT r.rating_value
            FROM ratings r
            JOIN movies m ON m.id = r.movie_id
            WHERE r.user_id = $1 AND m.tmdb_id = $2
        `;
        
        const result = await db.query(query, [userId, movieId]);

        if (result.rows.length > 0) {
            res.status(200).json({ rating: result.rows[0].rating_value });
        } else {
            res.status(200).json({ rating: null });
        }
    } catch (error) {
        console.error("Error fetching user rating:", error);
        res.status(500).json({ message: "Error fetching rating.", error: error.message });
    }
};