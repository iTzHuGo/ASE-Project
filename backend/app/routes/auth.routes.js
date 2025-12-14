// app/routes/auth.routes.js

import express from "express";

import * as controller from "../controllers/auth.controller.js";

import { verifySignUp } from "../middlewares/index.js";

const router = express.Router();
 
// Signup Route
router.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup,
);
 
// Signin Route
router.post("/signin", controller.signin);
 
export default router;