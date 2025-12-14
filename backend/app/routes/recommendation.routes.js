// app/routes/recommendation.routes.js
import express from "express";
import { getRatedMoviesByUser, getRecommendationsForMovie, getRecommendationsForUser } from "../controllers/recommendation.controller.js";


const router = express.Router();
 
// ---- USER RATINGS ROUTE
// this is a helper rout for flask to get the movies rated by a USER
// its simple this way instead of sending them on the recomendation route for user ID
router.get("/user/:userId", getRatedMoviesByUser);


// ---- RECOMENDATION ROUTES ----


// GET /api/recommendation/movie?title=Inception
// Uses QUERY PAREMETER for the movie title
// Calls the flask api recommendation based on a movie
router.get("/recommendation/movie/", getRecommendationsForMovie)


// GET /api/recommendation/movie?title=Inception
// Uses PATH VARIABLE for the user Id
// Calls the flask api for recommendation based on user rated movies
router.get("/recommendation/user/:userId", getRecommendationsForUser)


export default router;