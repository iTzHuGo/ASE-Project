// app/config/db.config.js
import { Pool } from 'pg';
import 'dotenv/config.js';

const pool = new Pool({
    user: process.env.POSTGRES_USER ,
    host: process.env.DB_HOST || 'db', // 'db' é o nome do serviço no docker-compose
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

export default {
    query: (text, params) => pool.query(text, params),
};
