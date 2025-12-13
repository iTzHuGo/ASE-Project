// app/routes/auth.routes.js

const express = require("express");

const controller = require("../controllers/recommendation.controller.js");


const router = express.Router();
 
 
// Route for the flask service to fect users movies

//full path : /api/recommend/user/:userId
router.get("/user/:userId", controller.getRatedMoviesByUser);

router.post("/movie-recommendation", controller.recommendBasedOnMovie);
 
module.exports = router;