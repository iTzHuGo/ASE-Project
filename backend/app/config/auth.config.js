// app/config/auth.config.js

require('dotenv').config();

export const secret = process.env.JWT_SECRET;