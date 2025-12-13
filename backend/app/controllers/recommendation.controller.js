// app/controllers/recommendation.controller.js

const db = require("../config/db.config.js");
const _query = db.query;
// Importação dinâmica para node-fetch (compatível com CJS)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;



exports.recommendBasedOnMovie = async (req, res) => {
    const title = req.body.title;
    const topN = req.body.topN || 5;
    
    try {
        
            // enviar request ao api do flask
        const response = await fetch('http://localhost:5000/recommend/movie/<title>', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, topN })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations from Flask service');
        }

        const recommendations = await response.json();

        return res.status(200).json({
            message: 'Recommendations fetched successfully.',
            recommendations: recommendations
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching recommendations!", error: err.message });
    }
}

export const getRatedMoviesByUser = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required in the path." });
    }

    try {

        // QUERY A DB PARA OBTER OS FILMES AVALIADOS PELO USER
        const sql = `
           SELECT r.rating_value AS rating, m.tmdb_id
            FROM ratings r
            JOIN movies m ON m.id = r.movie_id
            WHERE r.user_id = $1;
        `;

        const results = await _query(sql, [userId]);
        const dbRatings = results.rows;

        if (dbRatings.length === 0) {
            return res.status(404).json({
                message: `No ratings found for user ID ${userId}.`
            });
        }

        const enrichmentPromises = dbRatings.map(async (rating) => {
            const genreIds = await getTmdbMovieGenres(rating.tmdb_id);
            return {
                id: row.movie_id,
                rating: row.rating_value,
                tmdb_id: rating.tmdb_id,
                genres: genreIds
            };
        });

        const enrichedRatings = await Promise.all(enrichmentPromises);

        return res.status(200).json({
        user_id: userId,
        ratings: rows,
        count: rows.length,
        });
    } catch (err) {
        return res.status(500).json({ message: "DB error", error: err.message });
    }
}
        

export const recommendForUser = async (req, res) => {
    const userId = req.body.userId;
    const topN = req.body.topN || 5;

    try {
        
            // enviar request ao api do flask
        const response = await fetch('https://localhost:5000/recommend/user/<userId>', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, topN })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations from Flask service');
        }

        const recommendations = await response.json();

        return res.status(200).json({
            message: 'User recommendations fetched successfully.',
            recommendations: recommendations
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user recommendations!", error: err.message });
    }

}
    const getTmdbMovieGenres = async (tmdbMovieId) => {

        const url = `${TMDB_API_URL}/movie/${tmdbMovieId}?api_key=${TMDB_API_KEY}`;

        try {
            const response  = await fetch(url);

            if (!response.ok) {
                console.error("TMDB Error for ID ${tmdbMovieId}:", response.statusText);
                return [];
            }

            const data = await response.json();
            return data.genres.map(genre => genre.name);
        } catch (e) {
            console.error(`Network or Parsing Error fetching ${tmdbMovieId}:`, e);
            return [];
        }
    }
    

    export {recommendBasedOnMovie};
    export {getRatedMoviesByUser};