// app/config/db.config.js

import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: 'bd',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

export function query(text, params) { return pool.query(text, params); }