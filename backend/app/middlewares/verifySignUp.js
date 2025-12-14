// app/middleware/verifySignUp.js

import db from "../config/db.config.js";

const ROLES = ["user", "admin"];

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.password;

    try {
        if (!username || !email || !pass) {
            return res.status(400).json({ message: "Username, Email, and Password are required!" });
        }

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

const checkPassowordStrength = (req, res, next) => {
    const pass = req.body.password;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(pass)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
    }

    next();
}

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
    checkPassowordStrength
};

export default verifySignUp;