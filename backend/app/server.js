// app/server.js
import db from './config/db.config.js';

import express from 'express';
import cors from 'cors';


import authRoutes from "./routes/auth.routes.js";
import recommendationRoutes from './routes/recommendation.routes.js';



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Movie App Backend!' });
});

// Health check endpoint
app.get('/api/health',  async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ status: 'BACKEND is healthy', db_time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'Error connecting to DB', error: err.message });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recommendation', recommendationRoutes);



// Set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});