import express from "express";
import userController from "../controllers/user.controller.js";
import cartController from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/sign_up", userController.signUp);

//cart
router.get("/:userID/carts", cartController.getAllByUserID);

router.put("/:userID/carts/:productID", cartController.addProductToCart);

router.patch(
  "/:userID/carts/:productID",
  cartController.updateProductQuantityInCart
);

router.delete(
  "/:userID/carts/:productID",
  cartController.deleteProductFromCart
);

export default router;
