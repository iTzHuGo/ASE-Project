// app/controllers/auth.controller.js

import { query as _query } from "../config/db.config.js";


export const recommendBasedOnMovie = async (req, res) => {
    const title = req.body.title;
    const topN = req.body.topN || 5;
    
    try {
        
            // enviar request ao api do flask
        const response = await fetch('https://localhost:5000/recommend/movie/<title>', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, topN })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations from Flask service');
        }

        const recommendations = await response.json();

        return res.status(200).json({
            message: 'Recommendations fetched successfully.',
            recommendations: recommendations
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching recommendations!", error: err.message });
    }
}