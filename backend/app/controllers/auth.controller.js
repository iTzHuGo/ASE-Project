const db = require("../config/db.config.js");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ==========================================
// FEATURE: SIGNUP (REGISTO)
// METHOD: MANUAL CODING
// AUTHOR: Oleksandr
// DESCRIPTION: Controller to handle user signup requests, including
//              validation, password hashing, and storing user data in the database.
// ==========================================
exports.signup = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    
    const role = req.body.roles || "user";

    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const query = 
        `INSERT INTO users (username, email, password, role)
        VALUES ($1, $2, $3, $4) RETURNING id, username, email, role`;

        const values = [username, email, hashedPassword, role];

        const results = await db.query(query, values);

        res.status(201).json({
            message: "User registered successfully!",
            user: results.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user!", error: err.message });
    }
};
