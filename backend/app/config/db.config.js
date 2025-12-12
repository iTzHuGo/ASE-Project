// app/config/db.config.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || process.env.DB_USER,
    host: process.env.DB_HOST || 'db', // 'db' é o nome do serviço no docker-compose
    database: process.env.POSTGRES_DB || process.env.DB_NAME,
    password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};