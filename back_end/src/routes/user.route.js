import express from "express";
import userController from "../controllers/user.controller.js";
import cartController from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/sign_up", userController.signUp);

// user information
//-- for user and admin
router.get("/:userID", userController.getOne);

//-- for user
router.patch("/:userID/me", userController.updateOne);

router.patch("/:userID/me/password", userController.updatePasswordByUser);

//-- for admin
router.get("/", userController.getAll);

router.patch("/:userID/password", userController.updatePasswordByAdmin);

router.patch("/:userID/active_status", userController.updateActiveStatus);

//cart

router.put("/:userID/carts/:productID", cartController.addProductToCart);

//check_out
router.get("/:userID/check_out", cartController.getCheckOutInfo);

router.patch(
  "/:userID/carts/:productID",
  cartController.updateProductQuantityInCart
);

router.delete(
  "/:userID/carts/:productID",
  cartController.deleteProductFromCart
);

export default router;
