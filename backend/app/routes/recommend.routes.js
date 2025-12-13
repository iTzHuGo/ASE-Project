// app/routes/auth.routes.js

import express from "express";

import {
    recommendBasedOnMovie,
    getRatedMoviesByUser
} from "../controllers/recommendation.controller.js";


const router = express.Router();
 
 
router.get("/user/:userId", getRatedMoviesByUser);
 
export default router;