// app/routes/auth.routes.js

// 1. Mudar IMPORT para REQUIRE
const express = require("express");

const controller = require("../controllers/auth.controller.js");

const controllerAI = require("../controllers/auth.AI.controller.js");

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

// Signup Route AI
router.post(
    "/signup_ai",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controllerAI.signup,
);
 
// Signin Route AI
router.post("/signin_ai", controllerAI.signin);

module.exports = router;