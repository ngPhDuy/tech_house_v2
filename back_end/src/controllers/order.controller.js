import orderService from "../services/order.service.js";

const getAll = async (req, res) => {
  try {
    const { limit = 10, page = 1, search } = req.query;

    const result = await orderService.getAll(limit, page, search);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const { orderID } = req.params;

    const result = await orderService.getOne(orderID);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createOne = async (req, res) => {
  try {
    const { userID, totalPrice } = req.body;

    if (!userID || !totalPrice) {
      return res
        .status(400)
        .json({ message: "User ID and total price are required" });
    }

    const result = await orderService.createOne(userID, totalPrice);

    if (result) {
      res.status(201).json({ message: "Order created successfully", result });
    } else {
      res.status(400).json({ message: "Order creation failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createOneWithAProduct = async (req, res) => {
  try {
    const { productID } = req.params;

    const { userID, quantity, totalPrice } = req.body;

    if (!userID || !quantity || !totalPrice || !productID) {
      return res.status(400).json({
        message: "User ID, quantity, total price and product ID are required",
      });
    }

    const result = await orderService.createOneWithAProduct(
      userID,
      productID,
      quantity,
      totalPrice
    );

    if (result) {
      res.status(201).json({ message: "Order created successfully", result });
    } else {
      res.status(400).json({ message: "Order creation failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { status } = req.body;

    if (!orderID || !status) {
      return res
        .status(400)
        .json({ message: "Order ID and status are required" });
    }

    const result = await orderService.updateStatus(orderID, status);

    if (result) {
      res.status(200).json({ message: "Order status updated successfully" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateDeliveryTime = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { deliveryTime } = req.body;

    if (!orderID || !deliveryTime) {
      return res
        .status(400)
        .json({ message: "Order ID and delivery time are required" });
    }

    const result = await orderService.updateDeliveryTime(orderID, deliveryTime);

    if (result) {
      res
        .status(200)
        .json({ message: "Order delivery time updated successfully" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAll,
  getOne,
  createOne,
  createOneWithAProduct,
  updateStatus,
  updateDeliveryTime,
};
