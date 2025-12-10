const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    try {
        const result = db.query('SELECT NOW()');
        res.json({ status: 'API is healthy', db_time: result.rows[0].now 

        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'Error connecting to DB', error: err.message });
    }
});

