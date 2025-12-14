// app/routes/recommendation.routes.js
import express from "express";
import {getRecommendationsForMovie, getRecommendationsForUser } from "../controllers/recommendation.controller.js";


const router = express.Router();
 
// ---- RECOMENDATION ROUTES ----


// GET /api/recommendation/movie?title=Inception
// Uses QUERY PAREMETER for the movie title
// Calls the flask api recommendation based on a movie
router.get("/movie", getRecommendationsForMovie)


// GET /api/recommendation/movie?title=Inception
// Uses PATH VARIABLE for the user Id
// Calls the flask api for recommendation based on user rated movies
router.get("/user/:userId", getRecommendationsForUser)


export default router;