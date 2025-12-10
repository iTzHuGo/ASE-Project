// app/middleware/verifySignUp.js

import { query } from "../config/db.config";

const ROLES = ["user", "admin"];

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;

    try {
        const userByUsername = await query("SELECT id FROM users WHERE username = $1", [username]);
        const userByEmail = await query("SELECT id FROM users WHERE email = $1", [email]);
        if (userByUsername.rows.length > 0 || userByEmail.rows.length > 0) {
            return res.status(400).json({ message: "Failed! Username or Email is already in use!" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to validate username/email!" });
    }
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        if (!ROLES.includes(req.body.roles)) {
            return res.status(400).json({
                message: `Failed! Role ${req.body.roles} does not exist!`
            });
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

export default verifySignUp;