// app/middleware/authJwt.js

import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { query as _query } from "../config/db.config.js";
import { secret } from "../config/auth.config.js";

// 1. Verify JWT Token
const verifyToken = (req, res, next) => {

    // Search for token in headers
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }

    verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

// 2. Verify Admin Role
const isAdmin = async (req, res, next) => {
  try {
    const query = "SELECT role FROM users WHERE id = $1";
    const result = await _query(query, [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if the role is admin
    if (result.rows[0].role === "admin") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (error) {
    return res.status(500).send({ message: "Unable to validate User role!" });
  }
};

const authJwt = {
    verifyToken,
    isAdmin
};

export default authJwt;