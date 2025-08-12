import express from "express";
import orderController from "../controllers/order.controller.js";
import ratingController from "../controllers/rating.controller.js";

const router = express.Router();

router.get("/", orderController.getAll);

router.get("/:orderID", orderController.getOne);

router.post("/", orderController.createOne);

router.patch("/:orderID/status", orderController.updateStatus);

router.patch("/:orderID/delivery_time", orderController.updateDeliveryTime);

router.get("/:orderID/ratings", ratingController.getAllByOrderID);

router.post("/:orderID/products/:productID", ratingController.createOne);

export default router;
