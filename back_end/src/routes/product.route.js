import express from "express";
import productController from "../controllers/product.controller.js";
import ratingController from "../controllers/rating.controller.js";
import orderController from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", productController.getAll);

router.get("/:productID", productController.getOne);

router.post("/", productController.createOne);

router.put("/:productID", productController.updateOne);

router.delete("/:productID", productController.deleteOne);

router.get("/:productID/ratings", ratingController.getAllByProductID);

router.post("/:productID/orders", orderController.createOneWithAProduct);

export default router;
