import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/sign_up", userController.signUp);

export default router;
