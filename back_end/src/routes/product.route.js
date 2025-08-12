import express from "express";
import productController from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", productController.getAll);

router.get("/:productID", productController.getOne);

router.post("/", productController.createOne);

router.put("/:productID", productController.updateOne);

router.delete("/:productID", productController.deleteOne);

export default router;
