// app/routes/user.routes.js
import express from "express";
import {
    allAccess,
    userBoard,
    adminBoard,
} from "../controllers/checkUser.controller.js";
import { authJwt } from "../middleware/index.js";
 
const router = express.Router();
 
// Public Route
router.get("/all", allAccess);
 
// User Route
router.get("/user", [authJwt.verifyToken], userBoard);

// Admin Route
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);
 
export default router;