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

        const { rows } = await db(sql, [userId]);
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
  
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "User ID must be an integer." });
  }

  try {
    const flaskEndpoint = `${FLASK_SERVICE_URL}/recommend/user`;

    const response = await axios.get(flaskEndpoint, {
      params: {
        user_id : userId
      }
    });

    res.status(200).json({
      user_id: userId,
      results: response.data
    });

  } catch (error){
    console.error("Error calling Flask GET Endpoit:", error.message);

    if (error.response) {
        // Flask returned an HTTP error (e.g., 404, 400, 500)
        const { status, data } = error.response;
        
        return res.status(status).json({
            error: "Flask service returned an error.",
            details: data,
            flask_status: status
        });
    }

    res.status(503).json({error: "Could not reach Flask service."})
  }
};


export const getRecommendationsForMovie = async (req, res) => {
  const movieTitle = req.query.title;
  
  if (!movieTitle) {
    return res.status(400).json({ message: "Movie title must be provided." });
  }

  try {
    const flaskEndpoint = `${FLASK_SERVICE_URL}/recommend/movie`;

    const response = await axios.get(flaskEndpoint, {
      params: {
        movie_title : movieTitle
      }
    });

    res.status(200).json({
      movie_title: movieTitle,
      results: response.data
    });

  } catch (error){
    console.error("Error calling Flask GET Endpoit:", error.message);

    if (error.response) {
        // Flask returned an HTTP error (e.g., 404, 400, 500)
        const { status, data } = error.response;
        
        return res.status(status).json({
            error: "Flask service returned an error.",
            details: data,
            flask_status: status
        });
    }

    res.status(503).json({error: "Could not reach Flask service."})
  }
};
