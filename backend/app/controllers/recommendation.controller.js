// app/controllers/recommendation.controller.js

import { query as _query } from "../config/db.config.js";


export const recommendBasedOnMovie = async (req, res) => {
    const title = req.body.title;
    const topN = req.body.topN || 5;
    
    try {
        
            // enviar request ao api do flask
        const response = await fetch('https://localhost:5000/recommend/movie/<title>', {
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
            SELECT movie_id, rating
            FROM user_ratings
            WHERE user_id = $1
        `;

        const results = await _query(sql, [userId]);

        const ratingsForRecommender = results.rows.map(row => ({
            id: row.movie_id,
            rating: row.rating
        }));

        return res.status(200).json({
            user_id: userId,
            ratings: ratingsForRecommender,
            count: ratingsForRecommender.length
        });
        
    } catch (err) {
        console.error("Database Error in getRatedMoviesByUser:", err);

        res.status(500).json({
            message: "Error fetching user ratings!",
            error: err.message
        });
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

