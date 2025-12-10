// app/controllers/auth.AI.controller.js

const db = require("../config/db.config.js");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth.config.js");

