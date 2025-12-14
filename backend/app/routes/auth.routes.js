// app/routes/auth.routes.js

// 1. Mudar IMPORT para REQUIRE
import { Router } from "express";

import { signup, signin } from "../controllers/auth.controller.js";
import { signup as _signup, signin as _signin } from "../controllers/auth.AI.controller.js";
import { verifySignUp } from "../middlewares/index.js";

const router = Router();
 
// Signup Route
router.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkPassowordStrength],
    signup,
);

// Signin Route
router.post("/signin", signin);

// Signup Route AI
router.post(
    "/signup_ai",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkPassowordStrength],
    _signup,
);
 
// Signin Route AI
router.post("/signin_ai", _signin);

export default router;