// app/config/db.config.js
import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER ,
    host: process.env.DB_HOST || 'db', // 'db' é o nome do serviço no docker-compose
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

export function query(text, params) { return pool.query(text, params); }