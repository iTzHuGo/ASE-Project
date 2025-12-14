// app/controllers/recommendation.controller.js

import db from "../config/db.config.js";
import axios from "axios";

const FLASK_SERVICE_URL = process.env.FLASK_SERVICE_URL || "http://localhost:8000";

export const getRatedMoviesByUser = async (req, res) => {
  /// Exemplo de formato de resposta
    /*
    {
  "user_id": 1,
  "ratings": [
    { "tmdb_id": 27205, "rating": 5, "genre_ids": [878, 28, 12] }
  ],
  "count": 1
}
    */

    const userId = Number(req.params.userId);
    
    if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "User ID must be an integer." });
  }

    try {

        // QUERY A DB PARA OBTER OS FILMES AVALIADOS PELO USER
        const sql = `
           SELECT 
              r.rating_value AS rating, 
              m.tmdb_id,
              m.genre_ids
            FROM ratings r
            JOIN movies m ON m.id = r.movie_id
            WHERE r.user_id = $1;
        `;

        const { rows } = await db.query(sql, [userId]);
        return res.status(200).json({
        user_id: userId,
        ratings: rows,
        count: rows.length,
        });
    } catch (err) {
        return res.status(500).json({ message: "DB error", error: err.message });
    }
}
        

export const getRecommendationsForUser = async (req, res) => {
  const userId = Number(req.params.userId);
  const top_n = Number(req.query.top_n) || 5;
  
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "User ID must be an integer." });
  }

  try {

    // FAZER QUERY DOS RATINGS DO USER
    const sql = `
            SELECT 
                r.rating_value AS rating, 
                m.tmdb_id,
                m.genre_ids
            FROM ratings r
            JOIN movies m ON m.id = r.movie_id
            WHERE r.user_id = $1;
        `;
    const { rows: userRatings } = await db.query(sql, [userId]);

    if (userRatings.length == 0){
      return res.status(404).json({ message: `User ${userId} has no ratings.` });
    }

    // FAZER POST AOS RATINGS PARA O FLASK
    const flaskEndpoint = `${FLASK_SERVICE_URL}/recommend/user/${userId}`;

    const response = await axios.post(
      `${flaskEndpoint}?top_n=${top_n}`,
      { ratings: userRatings}
    );

    res.status(200).json(response.data);

  } catch (error){
    console.error("Error calling Flask GET Endpoint:", error.message);

    if (error.response) {
        const { status, data } = error.response;
        return res.status(status).json(data);
    }

    res.status(503).json({ error: "Could not reach Flask service." });
  }
};


export const getRecommendationsForMovie = async (req, res) => {
  const movieTitle = req.query.title;
  const top_n = Number(req.query.top_n) || 5;
  
  if (!movieTitle) {
    return res.status(400).json({ message: "Movie title must be provided." });
  }

  try {
    const flaskEndpoint = `${FLASK_SERVICE_URL}/recommend/movie`;

    const response = await axios.get(flaskEndpoint, {
      params: { 
        title: movieTitle, // Axios handles encoding movieTitle and building the ?title=... string
        top_n 
      }
    });
    
    res.status(200).json(response.data);

  } catch (error){
    console.error("Error calling Flask GET Endpoint:", error.message);

    if (error.response) {
        const { status, data } = error.response;
        return res.status(status).json(data);
    }

    res.status(503).json({ error: "Could not reach Flask service." });
  }
};
