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

const getAllByOrderID = async (req, res) => {};

export default { getAllByProductID, getAllByOrderID };
