// app/routes/auth.routes.js

import express from "express";
import { authJwt } from "../middleware/index.js";


import { rateMovie } from "../controllers/user.controller.js";

const router = express.Router();
 


router.post("/rate", [authJwt.verifyToken], rateMovie);
 


export default router;