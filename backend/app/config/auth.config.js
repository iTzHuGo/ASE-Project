// app/config/auth.config.js

import 'dotenv/config.js';

export default {
    secret: process.env.JWT_SECRET
};