// app/controllers/auth.controller.js

import { query as _query } from "../config/db.config.js";
import { sign } from "jsonwebtoken";
import { hashSync, compareSync } from "bcryptjs";
import authConfig from "../config/auth.config.js";

// ==========================================
// FEATURE: SIGNUP (REGISTER)
// METHOD: MANUAL CODING
// AUTHOR: Oleksandr
// DESCRIPTION: Controller to handle user signup requests, including
//              validation, password hashing, and storing user data in the database.
// ==========================================
export async function signup(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    
    const role = req.body.roles || "user";

    try {
        const secretPassword = hashSync(req.body.password, 10);
        const query = 
        `INSERT INTO users (username, email, password, role)
        VALUES ($1, $2, $3, $4) RETURNING id, username, email, role`;

        const data = [username, email, secretPassword, role];

        const results = await _query(query, data);

        return res.status(201).json({
        message: 'User registered successfully.',
        user_details: {
            id: results.rows[0].id,
            username: results.rows[0].username,
            email: results.rows[0].email,
            role: results.rows[0].role,
        }
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user!", error: err.message });
    }
}


// ==========================================
// FEATURE: SIGNIN (LOGIN)
// METHOD: MANUAL CODING
// AUTHOR: Oleksandr
// DESCRIPTION: Controller to handle user signin requests, including
//              validation, password comparison, and JWT token generation.
// ==========================================
export async function signin(req, res) {
    const email = req.body.email;
    const pass = req.body.password;

    try {

        if (!email || !pass) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const query = 
        `SELECT * FROM users 
        WHERE email = $1`;

        const results = await _query(query, [email]);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = results.rows[0];

        const passwordIsValid = compareSync(pass, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ accessToken: null, message: "Invalid Email or Password." });
        }

        const jwtToken = sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

        const authority = "ROLE_" + user.role.toUpperCase();

        res.status(200).json({
            message: 'Authenticated successfully.',
            user_details: {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: [authority],
                accessToken: jwtToken
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing in user!", error: error.message });
    }
}