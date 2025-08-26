import express from "express";
import cartController from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware.authenticateToken,
  cartController.getAllByUserID
);

export default router;
