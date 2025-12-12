// app/routes/auth.routes.js

// 1. Mudar IMPORT para REQUIRE
const express = require("express");

const controller = require("../controllers/auth.controller.js");

const { verifySignUp } = require("../middlewares");

const router = express.Router();
 
// Signup Route
router.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup,
);
 
// Signin Route
router.post("/signin", controller.signin);
 
module.exports = router;