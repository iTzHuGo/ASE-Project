// app/routes/recommendation.routes.js
import express from "express";
import { getRatedMoviesByUser } from "../controllers/recommendation.controller.js";


const router = express.Router();
 
 
router.get("/user/:userId", getRatedMoviesByUser);
 
export default router;