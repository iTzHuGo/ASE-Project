// server/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const movieData = require('./movieData.json');
const userRatings = require('./userMovieRatings.json');
const genreList = require('./movieGenres.json');

const app = express();
const port = 5000; 

const pythonServerURL = 'http://localhost:8000';
const TMDB_SERVER_URL = 'https://api.themoviedb.org/3/';



app.use(cors());

app.use(express.json());

// A simple test route (API endpoint)
app.get('/api/greeting', (req, res) => {
    res.json({ message: "Hello from the Express.js backend!" });
});

// Endpoint to get all movies
app.get('/api/movies/all', (req, res) => {
    res.json({ movies: movieData });
});

app.get('/api/movie/genre/list', async (req, res) => {

    res.json({ genres: genreList });

});
    

// Endpoint to get users movie ratings
app.get('/api/userRatings/:userID', (req, res) => {
    const userID = req.params.userID;
   
    const userRating = userRatings[userID];
     
    if(!userRating) {
        return res.status(404).json({ error: "User not found" });
    }


    res.json({ ratings: userRating});
});



// Endpoint to get movie recommendations for a user
app.get('/api/recommendation/:userID', async (req, res) => {
    const userID = req.params.userID;
    
    try {
            // 1. buscar os dados dos users da BD
            const pythonResponse = await axios.get(`${pythonServerURL}/recommend/${userID}`);
            
            const recommendations = pythonResponse.data.recommendations; // lista de IDs de filmes recomendados


            // 3. buscar os dados dos filmes recomendados

            // 4. enviar a lista de resposta

            res.json({movies: fullMovieDetailsList}); // lista de filmes recomendados
    
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});