// app/server.js

import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { query } from './config/db.config.js';
import authRoutes from "./routes/auth.routes.js";


const app = express();


app.use(json());
app.use(urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Movie App Backend!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    try {
        const result = query('SELECT NOW()');
        res.json({ status: 'BACKEND is healthy', db_time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'Error connecting to DB', error: err.message });
    }
});

// Routes
app.use('/api/auth', authRoutes);


// Set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});