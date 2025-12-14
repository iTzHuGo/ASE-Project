// app/routes/user.routes.js
import express from "express";
import {
    allAccess,
    userBoard,
    adminBoard,
} from "../controllers/checkUser.controller.js";
import { rateMovie, addToWatchlist, getWatchlist, removeFromWatchlist, getUserRating } from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";
 
const router = express.Router();
 
// Public Route
router.get("/all", allAccess);
 
// User Route
router.get("/user", [authJwt.verifyToken], userBoard);

// Admin Route
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

// Rate Movie Route
router.post("/rate", [authJwt.verifyToken], rateMovie);
router.get("/rate/:movieId", [authJwt.verifyToken], getUserRating);

// Watchlist Route
router.post("/watchlist", [authJwt.verifyToken], addToWatchlist);
router.get("/watchlist", [authJwt.verifyToken], getWatchlist);
router.delete("/watchlist/:movieId", [authJwt.verifyToken], removeFromWatchlist);
 

export default router;