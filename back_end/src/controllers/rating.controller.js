import ratingService from "../services/rating.service.js";

const getAllByProductID = async (req, res) => {
  try {
    const { productID } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await ratingService.getAllByProductID(
      page,
      limit,
      productID
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Ratings not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllByOrderID = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { page = 1, limit = 3 } = req.query;

    const result = await ratingService.getAllByOrderID(page, limit, orderID);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Ratings not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createOne = async (req, res) => {
  try {
    const { orderID, productID } = req.params;
    const { userID, star, comment } = req.body;

    if (!userID || !star || !comment) {
      return res
        .status(400)
        .json({ message: "User ID, star and comment are required" });
    }

    const result = await ratingService.createOne(
      orderID,
      productID,
      userID,
      star,
      comment
    );

    if (result) {
      res.status(201).json({ message: "Rating created successfully", result });
    } else {
      res.status(400).json({ message: "Rating creation failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { getAllByProductID, getAllByOrderID, createOne };
