// app/routes/auth.routes.js

import express from "express";

import {
    recommendBasedOnMovie,
    getRatedMoviesByUser
} from "../controllers/recommendation.controller.js";


const router = express.Router();
 
 
// Route for the flask service to fect users movies

//full path : /api/recommend/user/:userId
router.get("/user/:userId",getRatedMoviesByUser );

router.post("/movie-recommendation", recommendBasedOnMovie);
 
export default router;